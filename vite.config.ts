import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'

/**
 * Serve the vendored onnxruntime glue verbatim in dev.
 *
 * onnxruntime loads its emscripten glue with a dynamic `import()`, and Vite
 * answers that with `?import` appended, which routes a `public/` file through
 * the transform pipeline. 20 KB of emscripten output does not survive that trip
 * — it 500s and the model silently never loads.
 *
 * Production is unaffected: `public/` is copied as-is and Vite is not in the
 * request path at all. This is a dev-server-only shim.
 */
function serveOrtRaw(): Plugin {
  return {
    name: 'serve-ort-raw',
    apply: 'serve',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        const path = req.url?.split('?')[0]
        if (!path?.startsWith('/ort/')) return next()
        try {
          const body = readFileSync(resolve(process.cwd(), 'public', path.slice(1)))
          res.setHeader(
            'Content-Type',
            path.endsWith('.wasm') ? 'application/wasm' : 'text/javascript',
          )
          res.end(body)
        } catch {
          next()
        }
      })
    },
  }
}

export default defineConfig({
  // Served from the domain root (Netlify/Render). If you ever move back to
  // GitHub Pages at /Portfolio, this must become '/Portfolio/' or every
  // asset path 404s.
  base: '/',
  plugins: [react(), serveOrtRaw()],
  resolve: {
    alias: [
      {
        // transformers.js imports the default `onnxruntime-web` entry, which is
        // the jsep build: WebGPU plus CPU, 21 MB of wasm. Nothing here needs
        // WebGPU — a MiniLM query embeds in ~10 ms warm on the CPU backend — so
        // the WebGPU half is capability that never runs. The `/wasm` subpath is
        // the CPU-only build and halves the wasm payload.
        //
        // The regex is anchored so it rewrites the bare specifier only and
        // leaves `onnxruntime-web/...` subpath imports alone; matching loosely
        // here rewrites `onnxruntime-web/wasm` into `onnxruntime-web/wasm/wasm`.
        find: /^onnxruntime-web$/,
        replacement: 'onnxruntime-web/wasm',
      },
    ],
  },
  optimizeDeps: {
    exclude: ['lucide-react'], // optional, keep if you need it
  },
})
