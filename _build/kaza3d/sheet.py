import sys
from PIL import Image
st = sys.argv[1].split(",") if len(sys.argv) > 1 else ["residential", "underground"]
views = ["aerial", "low", "elevation"]
W, H = 960, 600
c = Image.new("RGB", (W * len(st) + 10, H * 3 + 20), "red")
for j, v in enumerate(views):
    for i, s in enumerate(st):
        im = Image.open(f"_build/kaza3d/out/{v}-{s}.png").convert("RGB").resize((W, H))
        c.paste(im, (i * (W + 10), j * (H + 10)))
c.resize((c.width // 2, c.height // 2)).save("_build/kaza3d/out/sheet.png")
