const lib = new URL('../package/lib/', import.meta.url);



// eslint-disable-next-line @typescript-eslint/no-var-requires

async function crawlDir(dir) {
  for await (const dirEntry of Deno.readDir(dir)) {
    if(dirEntry.isFile && dirEntry.name.endsWith('.js')) {
      const fileUrl = new URL(dirEntry.name, dir);
      let text = await Deno.readTextFile(fileUrl);
  
      if(text.includes(`import { createRequire } from 'module';`)) {
        console.error(`Replacing in [${fileUrl.pathname}]`);
        text = text.replace(`import { createRequire } from 'module';`, '');
        text = text.replace(`const require = createRequire(import.meta.url);`, '');
  
        text = text.replace(`const escapeHtml = require('escape-html');`, `import { escapeHtml } from 'escape-html';`);  
        text = text.replace(`const parse5 = require('parse5');`, `import * as parse5 from 'parse5';`);
  
        await Deno.writeTextFile(fileUrl, text);
      }    
    } else if(dirEntry.isDirectory) {
      await crawlDir(new URL(dirEntry.name + '/', dir));
    }
  }
}

crawlDir(lib);