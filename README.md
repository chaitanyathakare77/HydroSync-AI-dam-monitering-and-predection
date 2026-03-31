# HydroSync-AI-dam-monitering-and-predection
```
chai_hydrosync
├─ backend
│  ├─ controllers
│  │  └─ authController.js
│  ├─ middleware
│  │  └─ authMiddleware.js
│  ├─ models
│  │  └─ User.js
│  ├─ package-lock.json
│  ├─ package.json
│  ├─ routes
│  │  └─ authRoutes.js
│  └─ server.js
├─ frontend
│  ├─ .next
│  │  └─ dev
│  │     ├─ build
│  │     │  ├─ chunks
│  │     │  │  ├─ [root-of-the-server]__44695d76._.js
│  │     │  │  ├─ [root-of-the-server]__44695d76._.js.map
│  │     │  │  ├─ [root-of-the-server]__6d51cb5d._.js
│  │     │  │  ├─ [root-of-the-server]__6d51cb5d._.js.map
│  │     │  │  ├─ [turbopack-node]_transforms_postcss_ts_df7a5b11._.js
│  │     │  │  ├─ [turbopack-node]_transforms_postcss_ts_df7a5b11._.js.map
│  │     │  │  ├─ [turbopack]_runtime.js
│  │     │  │  └─ [turbopack]_runtime.js.map
│  │     │  ├─ package.json
│  │     │  ├─ postcss.js
│  │     │  └─ postcss.js.map
│  │     ├─ build-manifest.json
│  │     ├─ cache
│  │     │  ├─ .rscinfo
│  │     │  ├─ next-devtools-config.json
│  │     │  └─ turbopack
│  │     │     └─ 23c46498
│  │     │        ├─ 00000002.sst
│  │     │        ├─ 00000003.sst
│  │     │        ├─ 00000004.sst
│  │     │        ├─ 00000005.sst
│  │     │        ├─ 00000011.sst
│  │     │        ├─ 00000013.sst
│  │     │        ├─ 00000021.sst
│  │     │        ├─ 00000022.sst
│  │     │        ├─ 00000023.sst
│  │     │        ├─ 00000024.sst
│  │     │        ├─ 00000030.sst
│  │     │        ├─ 00000032.sst
│  │     │        ├─ 00000036.sst
│  │     │        ├─ 00000038.sst
│  │     │        ├─ 00000046.sst
│  │     │        ├─ 00000047.sst
│  │     │        ├─ 00000048.sst
│  │     │        ├─ 00000049.sst
│  │     │        ├─ 00000055.sst
│  │     │        ├─ 00000057.sst
│  │     │        ├─ 00000062.sst
│  │     │        ├─ 00000063.sst
│  │     │        ├─ 00000068.sst
│  │     │        ├─ 00000069.sst
│  │     │        ├─ 00000070.sst
│  │     │        ├─ 00000071.sst
│  │     │        ├─ 00000078.sst
│  │     │        ├─ 00000079.sst
│  │     │        ├─ 00000080.sst
│  │     │        ├─ 00000081.sst
│  │     │        ├─ 00000088.sst
│  │     │        ├─ 00000089.sst
│  │     │        ├─ 00000090.sst
│  │     │        ├─ 00000091.sst
│  │     │        ├─ 00000102.sst
│  │     │        ├─ 00000103.sst
│  │     │        ├─ 00000108.sst
│  │     │        ├─ 00000109.sst
│  │     │        ├─ 00000110.sst
│  │     │        ├─ 00000111.sst
│  │     │        ├─ 00000118.sst
│  │     │        ├─ 00000119.sst
│  │     │        ├─ 00000123.sst
│  │     │        ├─ 00000125.sst
│  │     │        ├─ 00000130.sst
│  │     │        ├─ 00000131.sst
│  │     │        ├─ 00000136.sst
│  │     │        ├─ 00000137.sst
│  │     │        ├─ 00000138.sst
│  │     │        ├─ 00000139.sst
│  │     │        ├─ 00000145.sst
│  │     │        ├─ 00000147.sst
│  │     │        ├─ 00000152.sst
│  │     │        ├─ 00000153.sst
│  │     │        ├─ 00000158.sst
│  │     │        ├─ 00000159.sst
│  │     │        ├─ 00000164.sst
│  │     │        ├─ 00000165.sst
│  │     │        ├─ 00000170.sst
│  │     │        ├─ 00000171.sst
│  │     │        ├─ 00000175.sst
│  │     │        ├─ 00000177.sst
│  │     │        ├─ 00000178.sst
│  │     │        ├─ 00000179.sst
│  │     │        ├─ 00000185.sst
│  │     │        ├─ 00000187.sst
│  │     │        ├─ 00000191.sst
│  │     │        ├─ 00000193.sst
│  │     │        ├─ 00000197.sst
│  │     │        ├─ 00000199.sst
│  │     │        ├─ 00000204.sst
│  │     │        ├─ 00000205.sst
│  │     │        ├─ 00000210.sst
│  │     │        ├─ 00000211.sst
│  │     │        ├─ 00000212.sst
│  │     │        ├─ 00000213.sst
│  │     │        ├─ 00000219.sst
│  │     │        ├─ 00000221.sst
│  │     │        ├─ 00000226.sst
│  │     │        ├─ 00000227.sst
│  │     │        ├─ 00000228.sst
│  │     │        ├─ 00000229.sst
│  │     │        ├─ 00000235.sst
│  │     │        ├─ 00000237.sst
│  │     │        ├─ 00000241.sst
│  │     │        ├─ 00000243.sst
│  │     │        ├─ 00000247.sst
│  │     │        ├─ 00000249.sst
│  │     │        ├─ 00000253.sst
│  │     │        ├─ 00000255.sst
│  │     │        ├─ 00000259.sst
│  │     │        ├─ 00000261.sst
│  │     │        ├─ 00000262.sst
│  │     │        ├─ 00000263.sst
│  │     │        ├─ 00000273.sst
│  │     │        ├─ 00000275.sst
│  │     │        ├─ 00000280.sst
│  │     │        ├─ 00000281.sst
│  │     │        ├─ 00000282.sst
│  │     │        ├─ 00000283.sst
│  │     │        ├─ 00000289.sst
│  │     │        ├─ 00000291.sst
│  │     │        ├─ 00000295.sst
│  │     │        ├─ 00000297.sst
│  │     │        ├─ 00000302.sst
│  │     │        ├─ 00000303.sst
│  │     │        ├─ 00000307.sst
│  │     │        ├─ 00000309.sst
│  │     │        ├─ 00000310.sst
│  │     │        ├─ 00000311.sst
│  │     │        ├─ 00000317.sst
│  │     │        ├─ 00000319.sst
│  │     │        ├─ 00000324.sst
│  │     │        ├─ 00000325.sst
│  │     │        ├─ 00000330.sst
│  │     │        ├─ 00000331.sst
│  │     │        ├─ 00000335.sst
│  │     │        ├─ 00000337.sst
│  │     │        ├─ 00000341.sst
│  │     │        ├─ 00000343.sst
│  │     │        ├─ 00000347.sst
│  │     │        ├─ 00000349.sst
│  │     │        ├─ 00000354.sst
│  │     │        ├─ 00000355.sst
│  │     │        ├─ 00000356.sst
│  │     │        ├─ 00000357.sst
│  │     │        ├─ 00000364.sst
│  │     │        ├─ 00000365.sst
│  │     │        ├─ 00000366.sst
│  │     │        ├─ 00000367.sst
│  │     │        ├─ 00000374.sst
│  │     │        ├─ 00000375.sst
│  │     │        ├─ 00000379.sst
│  │     │        ├─ 00000381.sst
│  │     │        ├─ 00000386.sst
│  │     │        ├─ 00000387.sst
│  │     │        ├─ 00000388.sst
│  │     │        ├─ 00000389.sst
│  │     │        ├─ 00000396.sst
│  │     │        ├─ 00000397.sst
│  │     │        ├─ 00000402.sst
│  │     │        ├─ 00000403.sst
│  │     │        ├─ 00000407.sst
│  │     │        ├─ 00000409.sst
│  │     │        ├─ 00000413.sst
│  │     │        ├─ 00000415.sst
│  │     │        ├─ 00000416.sst
│  │     │        ├─ 00000417.sst
│  │     │        ├─ 00000424.sst
│  │     │        ├─ 00000425.sst
│  │     │        ├─ 00000426.sst
│  │     │        ├─ 00000427.sst
│  │     │        ├─ 00000433.sst
│  │     │        ├─ 00000435.sst
│  │     │        ├─ 00000440.sst
│  │     │        ├─ 00000441.sst
│  │     │        ├─ 00000442.sst
│  │     │        ├─ 00000443.sst
│  │     │        ├─ 00000453.sst
│  │     │        ├─ 00000454.sst
│  │     │        ├─ 00000455.sst
│  │     │        ├─ 00000456.sst
│  │     │        ├─ 00000463.sst
│  │     │        ├─ 00000464.sst
│  │     │        ├─ 00000465.sst
│  │     │        ├─ 00000466.sst
│  │     │        ├─ 00000472.sst
│  │     │        ├─ 00000474.sst
│  │     │        ├─ 00000475.sst
│  │     │        ├─ 00000476.sst
│  │     │        ├─ 00000486.sst
│  │     │        ├─ 00000488.sst
│  │     │        ├─ 00000493.sst
│  │     │        ├─ 00000494.sst
│  │     │        ├─ 00000499.sst
│  │     │        ├─ 00000500.sst
│  │     │        ├─ 00000501.sst
│  │     │        ├─ 00000502.sst
│  │     │        ├─ 00000508.sst
│  │     │        ├─ 00000510.sst
│  │     │        ├─ 00000515.sst
│  │     │        ├─ 00000516.sst
│  │     │        ├─ 00000521.sst
│  │     │        ├─ 00000522.sst
│  │     │        ├─ 00000527.sst
│  │     │        ├─ 00000528.sst
│  │     │        ├─ 00000532.sst
│  │     │        ├─ 00000534.sst
│  │     │        ├─ 00000538.sst
│  │     │        ├─ 00000540.sst
│  │     │        ├─ 00000545.sst
│  │     │        ├─ 00000546.sst
│  │     │        ├─ 00000551.sst
│  │     │        ├─ 00000552.sst
│  │     │        ├─ 00000556.sst
│  │     │        ├─ 00000558.sst
│  │     │        ├─ 00000563.sst
│  │     │        ├─ 00000564.sst
│  │     │        ├─ 00000569.sst
│  │     │        ├─ 00000570.sst
│  │     │        ├─ 00000575.sst
│  │     │        ├─ 00000576.sst
│  │     │        ├─ 00000581.sst
│  │     │        ├─ 00000582.sst
│  │     │        ├─ 00000587.sst
│  │     │        ├─ 00000588.sst
│  │     │        ├─ 00000589.sst
│  │     │        ├─ 00000590.sst
│  │     │        ├─ 00000597.sst
│  │     │        ├─ 00000598.sst
│  │     │        ├─ 00000599.sst
│  │     │        ├─ 00000600.sst
│  │     │        ├─ 00000606.sst
│  │     │        ├─ 00000608.sst
│  │     │        ├─ 00000613.sst
│  │     │        ├─ 00000614.sst
│  │     │        ├─ 00000615.sst
│  │     │        ├─ 00000616.sst
│  │     │        ├─ 00000623.sst
│  │     │        ├─ 00000624.sst
│  │     │        ├─ 00000625.sst
│  │     │        ├─ 00000626.sst
│  │     │        ├─ 00000633.sst
│  │     │        ├─ 00000634.sst
│  │     │        ├─ 00000635.sst
│  │     │        ├─ 00000636.sst
│  │     │        ├─ 00000643.sst
│  │     │        ├─ 00000644.sst
│  │     │        ├─ 00000645.sst
│  │     │        ├─ 00000646.sst
│  │     │        ├─ 00000652.sst
│  │     │        ├─ 00000654.sst
│  │     │        ├─ 00000659.sst
│  │     │        ├─ 00000660.sst
│  │     │        ├─ 00000661.sst
│  │     │        ├─ 00000662.sst
│  │     │        ├─ 00000669.sst
│  │     │        ├─ 00000670.sst
│  │     │        ├─ 00000671.sst
│  │     │        ├─ 00000672.sst
│  │     │        ├─ 00000678.sst
│  │     │        ├─ 00000679.sst
│  │     │        ├─ 00000681.del
│  │     │        ├─ 00000682.sst
│  │     │        ├─ 00000683.sst
│  │     │        ├─ 00000684.sst
│  │     │        ├─ 00000688.sst
│  │     │        ├─ 00000689.sst
│  │     │        ├─ 00000690.sst
│  │     │        ├─ 00000694.sst
│  │     │        ├─ 00000695.sst
│  │     │        ├─ 00000696.sst
│  │     │        ├─ 00000697.sst
│  │     │        ├─ 00000698.sst
│  │     │        ├─ CURRENT
│  │     │        └─ LOG
│  │     ├─ fallback-build-manifest.json
│  │     ├─ package.json
│  │     ├─ prerender-manifest.json
│  │     ├─ routes-manifest.json
│  │     ├─ server
│  │     │  ├─ app
│  │     │  │  ├─ dashboard
│  │     │  │  │  ├─ page
│  │     │  │  │  │  ├─ app-paths-manifest.json
│  │     │  │  │  │  ├─ build-manifest.json
│  │     │  │  │  │  ├─ next-font-manifest.json
│  │     │  │  │  │  ├─ react-loadable-manifest.json
│  │     │  │  │  │  └─ server-reference-manifest.json
│  │     │  │  │  ├─ page.js
│  │     │  │  │  ├─ page.js.map
│  │     │  │  │  └─ page_client-reference-manifest.js
│  │     │  │  ├─ home
│  │     │  │  │  ├─ page
│  │     │  │  │  │  ├─ app-paths-manifest.json
│  │     │  │  │  │  ├─ build-manifest.json
│  │     │  │  │  │  ├─ next-font-manifest.json
│  │     │  │  │  │  ├─ react-loadable-manifest.json
│  │     │  │  │  │  └─ server-reference-manifest.json
│  │     │  │  │  ├─ page.js
│  │     │  │  │  ├─ page.js.map
│  │     │  │  │  └─ page_client-reference-manifest.js
│  │     │  │  ├─ login
│  │     │  │  │  ├─ page
│  │     │  │  │  │  ├─ app-paths-manifest.json
│  │     │  │  │  │  ├─ build-manifest.json
│  │     │  │  │  │  ├─ next-font-manifest.json
│  │     │  │  │  │  ├─ react-loadable-manifest.json
│  │     │  │  │  │  └─ server-reference-manifest.json
│  │     │  │  │  ├─ page.js
│  │     │  │  │  ├─ page.js.map
│  │     │  │  │  └─ page_client-reference-manifest.js
│  │     │  │  ├─ map
│  │     │  │  │  ├─ page
│  │     │  │  │  │  ├─ app-paths-manifest.json
│  │     │  │  │  │  ├─ build-manifest.json
│  │     │  │  │  │  ├─ next-font-manifest.json
│  │     │  │  │  │  ├─ react-loadable-manifest.json
│  │     │  │  │  │  └─ server-reference-manifest.json
│  │     │  │  │  ├─ page.js
│  │     │  │  │  ├─ page.js.map
│  │     │  │  │  └─ page_client-reference-manifest.js
│  │     │  │  ├─ page
│  │     │  │  │  ├─ app-paths-manifest.json
│  │     │  │  │  ├─ build-manifest.json
│  │     │  │  │  ├─ next-font-manifest.json
│  │     │  │  │  ├─ react-loadable-manifest.json
│  │     │  │  │  └─ server-reference-manifest.json
│  │     │  │  ├─ page.js
│  │     │  │  ├─ page.js.map
│  │     │  │  ├─ page_client-reference-manifest.js
│  │     │  │  ├─ register
│  │     │  │  │  ├─ page
│  │     │  │  │  │  ├─ app-paths-manifest.json
│  │     │  │  │  │  ├─ build-manifest.json
│  │     │  │  │  │  ├─ next-font-manifest.json
│  │     │  │  │  │  ├─ react-loadable-manifest.json
│  │     │  │  │  │  └─ server-reference-manifest.json
│  │     │  │  │  ├─ page.js
│  │     │  │  │  ├─ page.js.map
│  │     │  │  │  └─ page_client-reference-manifest.js
│  │     │  │  ├─ visualize
│  │     │  │  │  ├─ page
│  │     │  │  │  │  ├─ app-paths-manifest.json
│  │     │  │  │  │  ├─ build-manifest.json
│  │     │  │  │  │  ├─ next-font-manifest.json
│  │     │  │  │  │  ├─ react-loadable-manifest.json
│  │     │  │  │  │  └─ server-reference-manifest.json
│  │     │  │  │  ├─ page.js
│  │     │  │  │  ├─ page.js.map
│  │     │  │  │  └─ page_client-reference-manifest.js
│  │     │  │  └─ _not-found
│  │     │  │     ├─ page
│  │     │  │     │  ├─ app-paths-manifest.json
│  │     │  │     │  ├─ build-manifest.json
│  │     │  │     │  ├─ next-font-manifest.json
│  │     │  │     │  ├─ react-loadable-manifest.json
│  │     │  │     │  └─ server-reference-manifest.json
│  │     │  │     ├─ page.js
│  │     │  │     ├─ page.js.map
│  │     │  │     └─ page_client-reference-manifest.js
│  │     │  ├─ app-paths-manifest.json
│  │     │  ├─ chunks
│  │     │  │  └─ ssr
│  │     │  │     ├─ src_app_5b2047f8._.js
│  │     │  │     ├─ src_app_5b2047f8._.js.map
│  │     │  │     ├─ src_app_layout_7c732b6a.js
│  │     │  │     ├─ src_app_layout_7c732b6a.js.map
│  │     │  │     ├─ src_app_page_e6bfee3a.js
│  │     │  │     ├─ src_app_page_e6bfee3a.js.map
│  │     │  │     ├─ [externals]_next_dist_1aaf5479._.js
│  │     │  │     ├─ [externals]_next_dist_1aaf5479._.js.map
│  │     │  │     ├─ [externals]_next_dist_c80f7c8f._.js
│  │     │  │     ├─ [externals]_next_dist_c80f7c8f._.js.map
│  │     │  │     ├─ [externals]_next_dist_shared_lib_no-fallback-error_external_59b92b38.js
│  │     │  │     ├─ [externals]_next_dist_shared_lib_no-fallback-error_external_59b92b38.js.map
│  │     │  │     ├─ [externals]__e6a4d965._.js
│  │     │  │     ├─ [externals]__e6a4d965._.js.map
│  │     │  │     ├─ [externals]__e8a2741f._.js
│  │     │  │     ├─ [externals]__e8a2741f._.js.map
│  │     │  │     ├─ [root-of-the-server]__00c7c595._.js
│  │     │  │     ├─ [root-of-the-server]__00c7c595._.js.map
│  │     │  │     ├─ [root-of-the-server]__0a651687._.js
│  │     │  │     ├─ [root-of-the-server]__0a651687._.js.map
│  │     │  │     ├─ [root-of-the-server]__0f79802e._.js
│  │     │  │     ├─ [root-of-the-server]__0f79802e._.js.map
│  │     │  │     ├─ [root-of-the-server]__1fc8b71a._.js
│  │     │  │     ├─ [root-of-the-server]__1fc8b71a._.js.map
│  │     │  │     ├─ [root-of-the-server]__2a3346a5._.js
│  │     │  │     ├─ [root-of-the-server]__2a3346a5._.js.map
│  │     │  │     ├─ [root-of-the-server]__2d5a86b6._.js
│  │     │  │     ├─ [root-of-the-server]__2d5a86b6._.js.map
│  │     │  │     ├─ [root-of-the-server]__307b5cb0._.js
│  │     │  │     ├─ [root-of-the-server]__307b5cb0._.js.map
│  │     │  │     ├─ [root-of-the-server]__375ce46a._.js
│  │     │  │     ├─ [root-of-the-server]__375ce46a._.js.map
│  │     │  │     ├─ [root-of-the-server]__5057a25b._.js
│  │     │  │     ├─ [root-of-the-server]__5057a25b._.js.map
│  │     │  │     ├─ [root-of-the-server]__616abd1f._.js
│  │     │  │     ├─ [root-of-the-server]__616abd1f._.js.map
│  │     │  │     ├─ [root-of-the-server]__70a73b34._.js
│  │     │  │     ├─ [root-of-the-server]__70a73b34._.js.map
│  │     │  │     ├─ [root-of-the-server]__7a94c4f4._.js
│  │     │  │     ├─ [root-of-the-server]__7a94c4f4._.js.map
│  │     │  │     ├─ [root-of-the-server]__86f0528d._.js
│  │     │  │     ├─ [root-of-the-server]__86f0528d._.js.map
│  │     │  │     ├─ [root-of-the-server]__a74b89f1._.js
│  │     │  │     ├─ [root-of-the-server]__a74b89f1._.js.map
│  │     │  │     ├─ [root-of-the-server]__a8ab9a0d._.js
│  │     │  │     ├─ [root-of-the-server]__a8ab9a0d._.js.map
│  │     │  │     ├─ [root-of-the-server]__a8ce7062._.js
│  │     │  │     ├─ [root-of-the-server]__a8ce7062._.js.map
│  │     │  │     ├─ [root-of-the-server]__bfc5221e._.js
│  │     │  │     ├─ [root-of-the-server]__bfc5221e._.js.map
│  │     │  │     ├─ [root-of-the-server]__d1a8fdf9._.js
│  │     │  │     ├─ [root-of-the-server]__d1a8fdf9._.js.map
│  │     │  │     ├─ [root-of-the-server]__de2e5fbb._.js
│  │     │  │     ├─ [root-of-the-server]__de2e5fbb._.js.map
│  │     │  │     ├─ [root-of-the-server]__e72d5ea2._.js
│  │     │  │     ├─ [root-of-the-server]__e72d5ea2._.js.map
│  │     │  │     ├─ [root-of-the-server]__eb86bc83._.js
│  │     │  │     ├─ [root-of-the-server]__eb86bc83._.js.map
│  │     │  │     ├─ [root-of-the-server]__eb8f9876._.js
│  │     │  │     ├─ [root-of-the-server]__eb8f9876._.js.map
│  │     │  │     ├─ [root-of-the-server]__f167f031._.js
│  │     │  │     ├─ [root-of-the-server]__f167f031._.js.map
│  │     │  │     ├─ [root-of-the-server]__febcbe6a._.js
│  │     │  │     ├─ [root-of-the-server]__febcbe6a._.js.map
│  │     │  │     ├─ [turbopack]_runtime.js
│  │     │  │     ├─ [turbopack]_runtime.js.map
│  │     │  │     ├─ _0231c0e5._.js
│  │     │  │     ├─ _0231c0e5._.js.map
│  │     │  │     ├─ _23d94cf4._.js
│  │     │  │     ├─ _23d94cf4._.js.map
│  │     │  │     ├─ _eb23c0b1._.js
│  │     │  │     ├─ _eb23c0b1._.js.map
│  │     │  │     ├─ _next-internal_server_app_dashboard_page_actions_7f01ccec.js
│  │     │  │     ├─ _next-internal_server_app_dashboard_page_actions_7f01ccec.js.map
│  │     │  │     ├─ _next-internal_server_app_home_page_actions_3545fce0.js
│  │     │  │     ├─ _next-internal_server_app_home_page_actions_3545fce0.js.map
│  │     │  │     ├─ _next-internal_server_app_login_page_actions_0e9aafc0.js
│  │     │  │     ├─ _next-internal_server_app_login_page_actions_0e9aafc0.js.map
│  │     │  │     ├─ _next-internal_server_app_map_page_actions_43c533dc.js
│  │     │  │     ├─ _next-internal_server_app_map_page_actions_43c533dc.js.map
│  │     │  │     ├─ _next-internal_server_app_page_actions_39d4fc33.js
│  │     │  │     ├─ _next-internal_server_app_page_actions_39d4fc33.js.map
│  │     │  │     ├─ _next-internal_server_app_register_page_actions_cf89a161.js
│  │     │  │     ├─ _next-internal_server_app_register_page_actions_cf89a161.js.map
│  │     │  │     ├─ _next-internal_server_app_visualize_page_actions_3699622e.js
│  │     │  │     ├─ _next-internal_server_app_visualize_page_actions_3699622e.js.map
│  │     │  │     ├─ _next-internal_server_app__not-found_page_actions_554ec2bf.js
│  │     │  │     └─ _next-internal_server_app__not-found_page_actions_554ec2bf.js.map
│  │     │  ├─ interception-route-rewrite-manifest.js
│  │     │  ├─ middleware-build-manifest.js
│  │     │  ├─ middleware-manifest.json
│  │     │  ├─ next-font-manifest.js
│  │     │  ├─ next-font-manifest.json
│  │     │  ├─ pages
│  │     │  │  ├─ _app
│  │     │  │  │  ├─ build-manifest.json
│  │     │  │  │  ├─ client-build-manifest.json
│  │     │  │  │  ├─ next-font-manifest.json
│  │     │  │  │  ├─ pages-manifest.json
│  │     │  │  │  └─ react-loadable-manifest.json
│  │     │  │  ├─ _app.js
│  │     │  │  ├─ _app.js.map
│  │     │  │  ├─ _document
│  │     │  │  │  ├─ next-font-manifest.json
│  │     │  │  │  ├─ pages-manifest.json
│  │     │  │  │  └─ react-loadable-manifest.json
│  │     │  │  ├─ _document.js
│  │     │  │  ├─ _document.js.map
│  │     │  │  ├─ _error
│  │     │  │  │  ├─ build-manifest.json
│  │     │  │  │  ├─ client-build-manifest.json
│  │     │  │  │  ├─ next-font-manifest.json
│  │     │  │  │  ├─ pages-manifest.json
│  │     │  │  │  └─ react-loadable-manifest.json
│  │     │  │  ├─ _error.js
│  │     │  │  └─ _error.js.map
│  │     │  ├─ pages-manifest.json
│  │     │  ├─ server-reference-manifest.js
│  │     │  └─ server-reference-manifest.json
│  │     ├─ static
│  │     │  ├─ chunks
│  │     │  │  ├─ pages
│  │     │  │  │  ├─ _app.js
│  │     │  │  │  └─ _error.js
│  │     │  │  ├─ pages__app_0fce199e._.js.map
│  │     │  │  ├─ pages__app_2da965e7._.js
│  │     │  │  ├─ pages__error_2da965e7._.js
│  │     │  │  ├─ pages__error_af01c4e3._.js.map
│  │     │  │  ├─ src_app_008c59b9._.js
│  │     │  │  ├─ src_app_008c59b9._.js.map
│  │     │  │  ├─ src_app_dashboard_page_8e9f1618.js
│  │     │  │  ├─ src_app_dashboard_page_jsx_7ec0e448._.js
│  │     │  │  ├─ src_app_dashboard_page_jsx_8e9f1618._.js
│  │     │  │  ├─ src_app_favicon_ico_mjs_81d86e48._.js
│  │     │  │  ├─ src_app_globals_91e4631d.css
│  │     │  │  ├─ src_app_globals_91e4631d.css.map
│  │     │  │  ├─ src_app_home_page_8e9f1618.js
│  │     │  │  ├─ src_app_layout_1cf6b850.js
│  │     │  │  ├─ src_app_login_page_8e9f1618.js
│  │     │  │  ├─ src_app_map_DamMap_1c520e14.js
│  │     │  │  ├─ src_app_map_DamMap_20df40a5.js
│  │     │  │  ├─ src_app_map_DamMap_324f0046.js
│  │     │  │  ├─ src_app_map_DamMap_324f0046.js.map
│  │     │  │  ├─ src_app_map_DamMap_38d21f0f.js
│  │     │  │  ├─ src_app_map_DamMap_38d21f0f.js.map
│  │     │  │  ├─ src_app_map_DamMap_3fdb8c16.js
│  │     │  │  ├─ src_app_map_DamMap_6a72a477.js
│  │     │  │  ├─ src_app_map_DamMap_6a72a477.js.map
│  │     │  │  ├─ src_app_map_DamMap_71ec332a.js
│  │     │  │  ├─ src_app_map_DamMap_71ec332a.js.map
│  │     │  │  ├─ src_app_map_DamMap_9bfe9a0e.js
│  │     │  │  ├─ src_app_map_DamMap_9bfe9a0e.js.map
│  │     │  │  ├─ src_app_map_DamMap_ac8209da.js
│  │     │  │  ├─ src_app_map_DamMap_bf44a119.js
│  │     │  │  ├─ src_app_map_DamMap_d67a1ec4.js
│  │     │  │  ├─ src_app_map_DamMap_d67a1ec4.js.map
│  │     │  │  ├─ src_app_map_page_8e9f1618.js
│  │     │  │  ├─ src_app_page_04049cc7.js
│  │     │  │  ├─ src_app_page_7ec0e448.js
│  │     │  │  ├─ src_app_page_8e9f1618.js
│  │     │  │  ├─ src_app_page_cf51c7e1.js
│  │     │  │  ├─ src_app_page_cf51c7e1.js.map
│  │     │  │  ├─ src_app_register_page_8e9f1618.js
│  │     │  │  ├─ src_app_visualize_page_4483482c.js
│  │     │  │  ├─ src_app_visualize_page_4483482c.js.map
│  │     │  │  ├─ src_app_visualize_page_8e9f1618.js
│  │     │  │  ├─ turbopack-pages__app_0fce199e._.js
│  │     │  │  ├─ turbopack-pages__error_af01c4e3._.js
│  │     │  │  ├─ turbopack-_23a915ee._.js
│  │     │  │  ├─ [next]_entry_page-loader_ts_43b523b5._.js
│  │     │  │  ├─ [next]_entry_page-loader_ts_43b523b5._.js.map
│  │     │  │  ├─ [next]_entry_page-loader_ts_742e4b53._.js
│  │     │  │  ├─ [next]_entry_page-loader_ts_742e4b53._.js.map
│  │     │  │  ├─ [root-of-the-server]__092393de._.js
│  │     │  │  ├─ [root-of-the-server]__092393de._.js.map
│  │     │  │  ├─ [root-of-the-server]__45f039c3._.js
│  │     │  │  ├─ [root-of-the-server]__45f039c3._.js.map
│  │     │  │  ├─ [turbopack]_browser_dev_hmr-client_hmr-client_ts_956a0d3a._.js
│  │     │  │  ├─ [turbopack]_browser_dev_hmr-client_hmr-client_ts_956a0d3a._.js.map
│  │     │  │  ├─ [turbopack]_browser_dev_hmr-client_hmr-client_ts_c7192189._.js
│  │     │  │  ├─ [turbopack]_browser_dev_hmr-client_hmr-client_ts_c8c997ce._.js
│  │     │  │  ├─ [turbopack]_browser_dev_hmr-client_hmr-client_ts_c8c997ce._.js.map
│  │     │  │  ├─ _0171c29f._.js
│  │     │  │  ├─ _0171c29f._.js.map
│  │     │  │  ├─ _23a915ee._.js.map
│  │     │  │  ├─ _281bfd8d._.js
│  │     │  │  ├─ _281bfd8d._.js.map
│  │     │  │  ├─ _3da8c5fe._.js
│  │     │  │  ├─ _3da8c5fe._.js.map
│  │     │  │  ├─ _707d6396._.js
│  │     │  │  ├─ _707d6396._.js.map
│  │     │  │  ├─ _71cb0afa._.js
│  │     │  │  ├─ _71cb0afa._.js.map
│  │     │  │  ├─ _7e0cdb5a._.js
│  │     │  │  ├─ _7e0cdb5a._.js.map
│  │     │  │  ├─ _a0ff3932._.js
│  │     │  │  ├─ _b3dda4f4._.js
│  │     │  │  ├─ _b3dda4f4._.js.map
│  │     │  │  ├─ _e25ddb0f._.js
│  │     │  │  ├─ _e25ddb0f._.js.map
│  │     │  │  ├─ _e8493b14._.js
│  │     │  │  ├─ _e8493b14._.js.map
│  │     │  │  ├─ _ead68211._.js
│  │     │  │  ├─ _ead68211._.js.map
│  │     │  │  ├─ _ed5a3702._.js
│  │     │  │  ├─ _ed5a3702._.js.map
│  │     │  │  ├─ _f7131292._.js
│  │     │  │  └─ _f7131292._.js.map
│  │     │  ├─ development
│  │     │  │  ├─ _buildManifest.js
│  │     │  │  ├─ _clientMiddlewareManifest.json
│  │     │  │  └─ _ssgManifest.js
│  │     │  └─ media
│  │     │     ├─ favicon.0b3bf435.ico
│  │     │     ├─ layers-2x.793209de.png
│  │     │     ├─ layers.78ca0acf.png
│  │     │     └─ marker-icon.b9f7ac13.png
│  │     ├─ trace
│  │     └─ types
│  │        └─ routes.d.ts
│  ├─ components.json
│  ├─ jsconfig.json
│  ├─ next.config.mjs
│  ├─ package-lock.json
│  ├─ package.json
│  ├─ postcss.config.js
│  ├─ public
│  │  ├─ csv
│  │  │  ├─ dams_villages.csv
│  │  │  └─ jayakwadi_with_outflow.csv
│  │  └─ icons
│  │     ├─ dam.png
│  │     └─ village.png
│  ├─ README.md
│  └─ src
│     ├─ app
│     │  ├─ components
│     │  │  ├─ DamCard.jsx
│     │  │  ├─ FeatureCard.jsx
│     │  │  ├─ Navbar.jsx
│     │  │  └─ Sidebar.jsx
│     │  ├─ dashboard
│     │  │  └─ page.jsx
│     │  ├─ favicon.ico
│     │  ├─ globals.css
│     │  ├─ home
│     │  │  └─ page.js
│     │  ├─ layout.js
│     │  ├─ login
│     │  │  └─ page.js
│     │  ├─ map
│     │  │  ├─ DamMap.js
│     │  │  └─ page.js
│     │  ├─ page.js
│     │  ├─ page.module.css
│     │  ├─ register
│     │  │  └─ page.js
│     │  └─ visualize
│     │     └─ page.js
│     ├─ components
│     │  └─ ui
│     │     ├─ button.jsx
│     │     ├─ card.jsx
│     │     ├─ dropdown-menu.jsx
│     │     ├─ input.jsx
│     │     └─ sheet.jsx
│     └─ lib
│        └─ utils.js
└─ README.md

```