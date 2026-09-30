"""Urban Kaza zoning model: white clay, orthographic, three views.

blender -b -P _build/kaza3d/model.py -- <views|all> <states|all> <spp> <w> <h>
Writes _build/kaza3d/out/<view>-<state>.png and anchors.json (projected label points).

Massing traced from the client's renders (end elevation measured at 18.1 px/m):
  - long slab, front face Y=0 facing the main road, 10 framed bays, X 0..34
  - end face X=34: two stone pillars (Y 0..10.5 and 13..23.5) split by a
    recessed lit slot; each pillar carries a loggia column on its inner edge
  - podium: recessed glazed ground floor + 1F band with vertical fins
  - 14 residential floors (2F-15F), top row of tall mullioned windows
  - URBAN KAZA stacked on the corner pillar, low annex behind pillar B
Units are metres.
"""
import bpy, bmesh, math, json, os, sys, random
from mathutils import Vector
from bpy_extras.object_utils import world_to_camera_view

OUT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "out")
ROOT = os.path.abspath(os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", ".."))
os.makedirs(OUT, exist_ok=True)
argv = sys.argv[sys.argv.index("--") + 1:] if "--" in sys.argv else []
VIEWS = argv[0].split(",") if len(argv) > 0 and argv[0] != "all" else ["aerial", "low", "elevation"]
STATES = argv[1].split(",") if len(argv) > 1 and argv[1] != "all" else ["none", "underground", "ground", "first", "residential", "rooftop"]
SPP = int(argv[2]) if len(argv) > 2 else 96
W, H = (int(argv[3]), int(argv[4])) if len(argv) > 4 else (2400, 1500)

bpy.ops.wm.read_factory_settings(use_empty=True)
sc = bpy.context.scene

def srgb(h):
    h = h.lstrip("#"); c = [int(h[i:i + 2], 16) / 255 for i in (0, 2, 4)]
    return tuple(((x + 0.055) / 1.055) ** 2.4 if x > 0.04045 else x / 12.92 for x in c)

def mat(name, hexc, rough=0.62):
    m = bpy.data.materials.new(name); m.use_nodes = True
    b = m.node_tree.nodes["Principled BSDF"]
    b.inputs["Base Color"].default_value = (*srgb(hexc), 1)
    b.inputs["Roughness"].default_value = rough
    return m

CLAY = mat("clay", "#ECE9E3")
CLAY_CTX = mat("clay_ctx", "#E4E1DB")
GROUND = mat("ground", "#F2F0EB", 0.8)
ROAD = mat("road", "#E2E0DB", 0.85)
TERRA = mat("terra", "#A6522F", 0.55)
GLASS = mat("glass", "#C9C5BE", 0.3)

COLL = {}
def coll(name):
    if name not in COLL:
        c = bpy.data.collections.new(name); sc.collection.children.link(c); COLL[name] = c
    return COLL[name]

def box(name, x, y, z, sx, sy, sz, m=CLAY, c="context"):
    """Axis-aligned box from its min corner and size."""
    me = bpy.data.meshes.new(name); bm = bmesh.new()
    bmesh.ops.create_cube(bm, size=1)
    for v in bm.verts:
        v.co.x = x + (v.co.x + 0.5) * sx
        v.co.y = y + (v.co.y + 0.5) * sy
        v.co.z = z + (v.co.z + 0.5) * sz
    bm.to_mesh(me); bm.free()
    o = bpy.data.objects.new(name, me); o.data.materials.append(m)
    coll(c).objects.link(o)
    return o

def join(objs, name):
    if not objs: return None
    bpy.ops.object.select_all(action="DESELECT")
    for o in objs: o.select_set(True)
    bpy.context.view_layer.objects.active = objs[0]
    bpy.ops.object.join(); objs[0].name = name
    return objs[0]

# ------------------------------------------------------------------ building
FL = 3.15
Z_G1, Z_F1 = 4.8, 8.8
N_RES = 14
Z_TOP = Z_F1 + N_RES * FL          # 52.9
Z_PAR = 55.0
B_DEPTH = 7.0
X_END, D = 34.0, 23.5
SL0, SL1 = 10.5, 13.0               # the recessed slot on the end face
LA = (2.5, 6.4); LB = (17.1, 21.0)  # loggia columns on the end face

ZONES = {k: [] for k in ["underground", "ground", "first", "residential", "rooftop"]}
def zbox(zone, name, *a, m=CLAY):
    o = box(name, *a, m=m, c="zone_" + zone); ZONES[zone].append(o); return o
def zsplit(name, x, y, sx, sy, z0, z1, m=CLAY):
    """A vertical element split across the zones by height."""
    for zone, a, b in (("ground", 0, Z_G1), ("first", Z_G1, Z_F1), ("residential", Z_F1, Z_PAR)):
        lo, hi = max(z0, a), min(z1, b)
        if hi > lo: zbox(zone, name, x, y, lo, sx, sy, hi - lo, m=m)

# underground: two parking levels under the footprint, ramp from the cross street
zbox("underground", "basement", -1, -1.5, -B_DEPTH, X_END + 2, D + 3.5, B_DEPTH - 0.05)
for i in (1, 2):
    zbox("underground", "bslab", -1.05, -1.55, -B_DEPTH + i * 3.3 - 0.9, X_END + 2.1, D + 3.6, 0.22)
zbox("underground", "ramp", X_END + 1.2, 12, -2.2, 0.3, 11, 2.4)

# main mass behind the front wall
zbox("ground", "core_g", 0, 1.6, 0, 31, D - 1.6, Z_G1)
zbox("first", "core_1", 0, 0.9, Z_G1, 31, D - 0.9, Z_F1 - Z_G1)
zbox("residential", "core_r", 0, 0.9, Z_F1, 31, D - 0.9, Z_TOP - Z_F1 + 0.9)

# the two pillars of the end face, each with a loggia column
for (y0, y1), (l0, l1) in (((0.0, SL0), LA), ((SL1, D), LB)):
    zsplit("pil", 31, y0, 3, l0 - y0, 0, Z_PAR)
    zsplit("pil", 31, l1, 3, y1 - l1, 0, Z_PAR)
    zsplit("pil_base", 31, l0, 3, l1 - l0, 0, Z_F1)
    zsplit("loggia_back", 31, l0, 2, l1 - l0, Z_F1, Z_PAR)
    zbox("residential", "pil_cap", 31, l0, Z_TOP + 0.4, 3, l1 - l0, Z_PAR - Z_TOP - 0.4)
    for r in range(N_RES):
        z = Z_F1 + r * FL
        zbox("residential", "balc", 33, l0 + 0.15, z, 2.3, l1 - l0 - 0.3, 0.24)
        zbox("residential", "rail", 35.18, l0 + 0.15, z + 0.24, 0.1, l1 - l0 - 0.3, 1.05, m=GLASS)
        zbox("residential", "door", 32.95, l0 + 0.6, z + 0.35, 0.1, l1 - l0 - 1.2, FL - 0.7, m=GLASS)
    zbox("rooftop", "planter", 33, l0 + 0.15, Z_TOP + 0.24, 2.2, l1 - l0 - 0.3, 0.9)
    for k in range(3):
        zsplit("base_slot", 33.95, l0 + 0.7 + k * 1.1, 0.1, 0.55, 5.4, 8.2, m=GLASS)
    zsplit("base_door", 33.95, l0 + 0.5, 0.1, l1 - l0 - 1.0, 0, 3.3, m=GLASS)

# the slot: recessed core with three small windows per floor
for r in range(N_RES + 2):
    z = 1.0 if r == 0 else Z_G1 + (r - 1) * FL
    for k in range(3):
        zsplit("slot_win", 30.95, SL0 + 0.35 + k * 0.72, 0.1, 0.45, z + 0.6, z + 2.4, m=GLASS)

# front wall: 10 framed bays over 14 floors, tall mullioned top row
BAYS, bw = 10, 3.3
xs = [0.3 + i * bw for i in range(BAYS)]
zbox("residential", "fw_edge", -0.1, 0, Z_F1, 0.4, 0.9, Z_PAR - Z_F1)
zbox("residential", "fw_corner", 33.3, 0, Z_F1, 0.7, 0.9, Z_PAR - Z_F1)
for r in range(N_RES):
    z = Z_F1 + r * FL
    top = r == N_RES - 1
    ztop = Z_PAR if top else z + FL
    ow, oh = 2.25, (3.5 if top else 2.05)
    zo = z + (0.35 if top else 0.55)
    for x in xs:
        ox = x + (bw - ow) / 2
        zbox("residential", "pier", x, 0, z, (bw - ow) / 2, 0.9, ztop - z)
        zbox("residential", "pier", ox + ow, 0, z, (bw - ow) / 2, 0.9, ztop - z)
        zbox("residential", "sill", ox, 0, z, ow, 0.9, zo - z)
        zbox("residential", "head", ox, 0, zo + oh, ow, 0.9, ztop - zo - oh)
        f = 0.14
        zbox("residential", "fr", ox - f, -0.18, zo - f, ow + 2 * f, 0.5, f)
        zbox("residential", "fr", ox - f, -0.18, zo + oh, ow + 2 * f, 0.5, f)
        zbox("residential", "fr", ox - f, -0.18, zo, f, 0.5, oh)
        zbox("residential", "fr", ox + ow, -0.18, zo, f, 0.5, oh)
        zbox("residential", "pane", ox, 0.6, zo, ow, 0.1, oh, m=GLASS)
        if top:
            zbox("residential", "mul", ox + ow / 2 - 0.05, 0.45, zo, 0.1, 0.12, oh)
            zbox("residential", "mul", ox, 0.45, zo + oh * 0.62, ow, 0.12, 0.1)
# back face and far end: punched windows
for r in range(N_RES):
    z = Z_F1 + r * FL + 0.55
    for x in xs:
        zbox("residential", "bpane", x + 0.5, D - 0.02, z, 2.25, 0.1, 2.05, m=GLASS)
    for k in range(4):
        zbox("residential", "lslot", -0.08, 2 + k * 5.5, z, 0.1, 1.0, 2.05, m=GLASS)

# podium: 1F band with fins, recessed glazed ground floor behind columns
zbox("first", "band", -0.4, -1.0, Z_G1, 31.4, 1.9, 0.5)
zbox("first", "band_top", -0.4, -1.0, Z_F1 - 0.55, 31.4, 1.9, 0.55)
zbox("first", "band_back", -0.4, 0.4, Z_G1 + 0.5, 31.4, 0.5, Z_F1 - Z_G1 - 1.05, m=GLASS)
for i in range(38):
    zbox("first", "fin", 0.1 + i * 0.815, -0.9, Z_G1 + 0.5, 0.34, 1.2, Z_F1 - Z_G1 - 1.05)
zbox("first", "band_end", -0.4, -1.0, Z_G1, 0.5, 1.9, Z_F1 - Z_G1)
zbox("ground", "gf_glass", 0, 1.5, 0, 31, 0.12, Z_G1 - 0.02, m=GLASS)
for i in range(7):
    zbox("ground", "gcol", 0.2 + i * 5.1, -0.7, 0, 0.8, 0.8, Z_G1)
zbox("ground", "annex", 29.5, D, 0, 6, 3.6, 4.6)

# rooftop: deck, parapets, a low shade frame kept below the parapet line
zbox("rooftop", "deck", 0.4, 1.0, Z_TOP + 0.9, 30.5, D - 1.4, 0.2)
zbox("rooftop", "par_b", 0, D - 0.3, Z_TOP + 0.9, 31, 0.3, Z_PAR - Z_TOP - 0.9)
zbox("rooftop", "par_l", -0.1, 0.9, Z_TOP + 0.9, 0.3, D - 0.9, Z_PAR - Z_TOP - 0.9)
for i in range(8):
    zbox("rooftop", "deck_line", 2 + i * 3.6, 2, Z_TOP + 1.1, 0.06, D - 4, 0.02, m=GLASS)
zbox("rooftop", "shade", 3, 4, Z_TOP + 1.7, 12, 8, 0.15)
for px, py in ((3.2, 4.2), (14.6, 4.2), (3.2, 11.6), (14.6, 11.6)):
    zbox("rooftop", "post", px, py, Z_TOP + 1.1, 0.2, 0.2, 0.6)

# URBAN KAZA stacked on the corner pillar, relief in the same clay
FONT = bpy.data.fonts.load(os.path.join(ROOT, "assets", "fonts", "FuturaPTMedium.otf"))
for i, ch in enumerate("URBANKAZA"):
    slot = i if i < 5 else i + 1
    cu = bpy.data.curves.new("L" + ch, "FONT"); cu.body = ch; cu.font = FONT
    cu.size = 2.1; cu.extrude = 0.06; cu.align_x = "CENTER"
    o = bpy.data.objects.new("L" + ch, cu); coll("zone_residential").objects.link(o)
    o.location = (X_END + 0.06, 1.25, 49.2 - slot * 2.62)
    o.rotation_euler = (math.radians(90), 0, math.radians(90))
    o.data.materials.append(CLAY)
    bpy.ops.object.select_all(action="DESELECT")
    bpy.context.view_layer.objects.active = o; o.select_set(True)
    bpy.ops.object.convert(target="MESH")
    ZONES["residential"].append(bpy.context.view_layer.objects.active)

for k in list(ZONES):
    ZONES[k] = join(ZONES[k], "zone_" + k)

# -------------------------------------------------------------------- context
HOLE = (-3, 40, -6, 29)   # cut-away around the building when the basement is shown
def ground_cut(cut, elevation=False):
    for o in list(coll("ground").objects):
        bpy.data.objects.remove(o, do_unlink=True)
    x0, x1, y0, y1 = HOLE
    if not cut:
        box("g", -400, -400, -8, 800, 900, 8, GROUND, "ground"); return
    box("g", -400, -400, -8, 400 + x0, 900, 8, GROUND, "ground")
    box("g", x0, y1, -8, x1 - x0, 500, 8, GROUND, "ground")
    box("g", x0, -400, -8, x1 - x0, 400 + y0, 8, GROUND, "ground")
    if not elevation:
        box("g", x1, -400, -8, 400, 900, 8, GROUND, "ground")

ctx = []
# corner site: main road along the front, cross street along the pillared end
ctx.append(box("road_main", -400, -30, -0.02, 800, 20, 0.03, ROAD))
ctx.append(box("road_cross", 44, -30, -0.02, 18, 430, 0.03, ROAD))
ctx.append(box("walk_f", -400, -10, 0, 444, 8.2, 0.16, GROUND))
ctx.append(box("walk_e", 36.2, -1.8, 0, 7.8, 440, 0.16, GROUND))
ctx.append(box("walk_f2", 62, -10, 0, 400, 8.2, 0.16, GROUND))
for i in range(40):
    ctx.append(box("lane", -390 + i * 20, -20.2, 0.01, 7, 0.3, 0.03, GROUND))
for i in range(8):
    ctx.append(box("zebra", 44.5 + i * 2.2, -9.9, 0.01, 1.1, 5.0, 0.03, GROUND))

rng = random.Random(11)
def office(x, y, w, d, floors, fh=3.8):
    h = floors * fh
    o = [box("off", x, y, 0, w, d, h, CLAY_CTX)]
    for f in range(1, floors):
        o.append(box("band", x - 0.25, y - 0.25, f * fh - 0.25, w + 0.5, d + 0.5, 0.35, CLAY_CTX))
    o.append(box("crown", x - 0.4, y - 0.4, h, w + 0.8, d + 0.8, 0.5, CLAY_CTX))
    return o
for args in [(-58, 0, 42, 30, 8), (-110, 2, 42, 26, 5), (-168, -2, 48, 34, 10), (-230, 2, 44, 30, 6),
             (70, 0, 40, 30, 11), (120, 4, 30, 26, 6), (160, -2, 50, 36, 9), (222, 0, 40, 30, 6),
             (-34, 42, 36, 30, 7), (8, 44, 30, 28, 9), (70, 46, 36, 30, 14), (-92, 50, 50, 32, 12),
             (132, 52, 44, 30, 15), (-160, 56, 40, 30, 8), (200, 56, 40, 36, 11), (-40, 90, 60, 40, 16),
             (40, 96, 50, 40, 12), (120, 100, 60, 36, 18)]:
    ctx += office(*args)
# a landscaped park across the main road keeps the podium visible
ctx.append(box("walk_p", -400, -36, 0, 800, 5, 0.16, GROUND))
for bx in (-300, -210, -120, -30, 60, 150, 240):
    ctx.append(box("lawn", bx + 3, -116, 0, 80, 78, 0.35, GROUND))
    ctx.append(box("lawn_path", bx + 40, -116, 0.36, 4, 78, 0.02, ROAD))

def tree(x, y, s=1.0):
    t = box("trunk", x - 0.15, y - 0.15, 0, 0.3, 0.3, 2.6 * s, CLAY_CTX)
    bpy.ops.mesh.primitive_ico_sphere_add(subdivisions=2, radius=2.2 * s, location=(x, y, 3.8 * s))
    c = bpy.context.active_object; c.data.materials.append(CLAY_CTX)
    for cc in c.users_collection: cc.objects.unlink(c)
    coll("context").objects.link(c); c.scale.z = 0.9
    return [t, c]
for i in range(36):
    x = -380 + i * 22
    if -8 < x < 42: continue
    ctx += tree(x, -7.5, rng.uniform(0.85, 1.1))
for x in (-6, 8, 22):
    ctx += tree(x, -8.2, 0.9)
for i in range(14):
    ctx += tree(41.2, 36 + i * 14, 0.95)
    ctx += tree(64.5, -4 + i * 14, 0.95)
for i in range(80):
    ctx += tree(rng.uniform(-300, 320), rng.uniform(-108, -42), rng.uniform(0.9, 1.4))
def car(x, y, rot=False):
    sx, sy = (4.5, 1.9) if not rot else (1.9, 4.5)
    return [box("car", x, y, 0.3, sx, sy, 0.8, CLAY_CTX),
            box("cab", x + (1.1 if not rot else 0.15), y + (0.15 if not rot else 1.1), 1.1,
                (2.3 if not rot else 1.6), (1.6 if not rot else 2.3), 0.6, CLAY_CTX)]
for x in (-120, -64, -22, 12, 80, 150, 205):
    ctx += car(x, -17.5); ctx += car(x + 30, -25)
ctx += car(47, -48, True); ctx += car(55, 18, True); ctx += car(47, 60, True)
for o in ctx:
    if o.name.startswith(("off", "car", "cab")):
        m = o.modifiers.new("bev", "BEVEL"); m.width = 0.05; m.segments = 2
def centre(o):
    return sum((o.matrix_world @ Vector(c) for c in o.bound_box), Vector()) / 8
east = [o for o in ctx if centre(o).x > 36]
rest = [o for o in ctx if centre(o).x <= 36]
CTX = {"east": join(east, "ctx_east"), "rest": join(rest, "ctx_rest")}

# ------------------------------------------------------------------ lighting
world = bpy.data.worlds.new("w"); sc.world = world; world.use_nodes = True
bg = world.node_tree.nodes["Background"]
bg.inputs["Color"].default_value = (*srgb("#F6F5F1"), 1); bg.inputs["Strength"].default_value = 0.62
sun = bpy.data.lights.new("sun", "SUN"); sun.energy = 4.2; sun.angle = math.radians(2.5)
so = bpy.data.objects.new("sun", sun); sc.collection.objects.link(so)
so.rotation_euler = (math.radians(52), 0, math.radians(128))   # from the front-right, lighting both faces

sc.render.engine = "CYCLES"
prefs = bpy.context.preferences.addons["cycles"].preferences
try:
    prefs.compute_device_type = "OPTIX"; prefs.get_devices()
    for d in prefs.devices: d.use = d.type == "OPTIX"
    sc.cycles.device = "GPU"
except Exception:
    pass
sc.cycles.samples = SPP
sc.cycles.use_denoising = True
sc.render.resolution_x, sc.render.resolution_y = W, H
sc.view_settings.view_transform = "AgX"
sc.view_settings.look = "AgX - Medium High Contrast"
sc.view_settings.exposure = 0.35
sc.render.image_settings.file_format = "PNG"

# ------------------------------------------------------------------- cameras
CAMS = {
    #            azimuth (deg from front, + toward the end face), elevation, ortho width, target
    "aerial":    (38, 32, 128, Vector((17, 11, 18))),
    "low":       (34, 7, 108, Vector((17, 11, 25))),
    "elevation": (90, 0, 112, Vector((17, 11.75, 24))),
}
def camera(view):
    az, el, scale, tgt = CAMS[view]
    cd = bpy.data.cameras.new(view); cd.type = "ORTHO"; cd.ortho_scale = scale
    cd.clip_start = 1; cd.clip_end = 2000
    o = bpy.data.objects.new("cam_" + view, cd); sc.collection.objects.link(o)
    a, e = math.radians(az), math.radians(el)
    d = Vector((math.sin(a) * math.cos(e), -math.cos(a) * math.cos(e), math.sin(e)))
    o.location = tgt + d * 600
    o.rotation_euler = (-d).to_track_quat("-Z", "Y").to_euler()
    return o

ANCHOR = {
    "underground": Vector((X_END, 6, -3.5)),
    "ground": Vector((X_END, 8, 2.4)),
    "first": Vector((X_END - 3, -1, 6.8)),
    "residential": Vector((X_END, 8.4, 30)),
    "rooftop": Vector((16, 12, Z_PAR)),
}

anchors = {}
for view in VIEWS:
    cam = camera(view); sc.camera = cam
    bpy.context.view_layer.update()
    anchors[view] = {}
    for z, p in ANCHOR.items():
        c = world_to_camera_view(sc, cam, p)
        anchors[view][z] = [round(c.x * 100, 2), round((1 - c.y) * 100, 2)]
    for state in STATES:
        ground_cut(state == "underground" or view == "elevation", elevation=view == "elevation")
        CTX["east"].hide_render = view == "elevation"
        for z, o in ZONES.items():
            for slot in o.material_slots:
                if slot.material in (CLAY, TERRA):
                    slot.material = TERRA if z == state else CLAY
        sc.render.filepath = os.path.join(OUT, f"{view}-{state}.png")
        bpy.ops.render.render(write_still=True)
        print("rendered", view, state, flush=True)
path = os.path.join(OUT, "anchors.json")
old = json.load(open(path)) if os.path.exists(path) else {}
old.update(anchors)
json.dump(old, open(path, "w"), indent=1)
print("done")
