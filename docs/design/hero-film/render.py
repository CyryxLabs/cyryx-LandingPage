import asyncio, sys, os, subprocess
from playwright.async_api import async_playwright
CUTS=[0,5,10.5,15,20,24]; FPS=30
async def main():
    only=[int(x) for x in sys.argv[1:]] or list(range(5))
    async with async_playwright() as p:
        b = await p.chromium.launch(executable_path="/usr/bin/google-chrome", args=["--no-sandbox","--allow-file-access-from-files"])
        pg = await b.new_page(viewport={"width":1600,"height":900})
        await pg.goto("file:///tmp/film/film.html"); await pg.wait_for_function("window.__ready===true")
        for i in only:
            tmp=f"/tmp/film/out/s{i}.tmp.mp4"; final=f"/tmp/film/out/s{i}.mp4"
            ff=subprocess.Popen(["ffmpeg","-v","error","-y","-f","image2pipe","-framerate",str(FPS),"-c:v","mjpeg","-i","-","-c:v","libx264","-crf","14","-preset","veryfast","-pix_fmt","yuv420p","-r",str(FPS),tmp],stdin=subprocess.PIPE)
            f0=round(CUTS[i]*FPS); f1=round(CUTS[i+1]*FPS)
            for f in range(f0,f1):
                await pg.evaluate(f"window.setT({f/FPS})")
                ff.stdin.write(await pg.screenshot(type="jpeg", quality=92))
            ff.stdin.close(); rc=ff.wait()
            if rc==0: os.replace(tmp,final)
            print("scene",i,f1-f0,"frames rc",rc, flush=True)
        await b.close()
asyncio.run(main())
