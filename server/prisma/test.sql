PRAGMA foreign_keys=OFF;
BEGIN TRANSACTION;
CREATE TABLE IF NOT EXISTS "_prisma_migrations" (
    "id"                    TEXT PRIMARY KEY NOT NULL,
    "checksum"              TEXT NOT NULL,
    "finished_at"           DATETIME,
    "migration_name"        TEXT NOT NULL,
    "logs"                  TEXT,
    "rolled_back_at"        DATETIME,
    "started_at"            DATETIME NOT NULL DEFAULT current_timestamp,
    "applied_steps_count"   INTEGER UNSIGNED NOT NULL DEFAULT 0
);
INSERT INTO _prisma_migrations VALUES('696ae243-e38e-4426-a402-96f6a06b2479','9ce2de3436a40d7fb6115f29c4ae01192e6e46efbd90549b997591b3196680b3',1740224289216,'20250122114230_init',NULL,NULL,1740224289105,1);
INSERT INTO _prisma_migrations VALUES('e02a9cf6-6ce6-497b-a29e-1fa2074ba469','14d791849f1bf18c8c499144ad5969289bfb309fe734874f47b9b151b19e7264',1740224289490,'20250122134323_add_affiliate',NULL,NULL,1740224289244,1);
INSERT INTO _prisma_migrations VALUES('38175875-0593-455c-9d09-723f755e55f8','0618d559d4b49f1783cefc223ce0015c5b7b05fd87275fc6867612b7345bdad6',1740224290266,'20250122195128_add_tables',NULL,NULL,1740224289518,1);
INSERT INTO _prisma_migrations VALUES('11d98508-c80f-4ec4-b3c2-e1566b0a7ded','e818f79138ecf76a8090c9482ce3f3d4b537d2f4142192060ee85da8d26a95cf',1740224290378,'20250126100415_add_unique',NULL,NULL,1740224290294,1);
INSERT INTO _prisma_migrations VALUES('21cf2ccf-74b6-4223-8a50-e26001f3e651','7836fb7852e1cf9423a47638fc6fb5749841ca60c6307a778898111b01e0170b',1740224290741,'20250128202325_add_labels',NULL,NULL,1740224290406,1);
INSERT INTO _prisma_migrations VALUES('d61c0353-b8c6-4241-a3e2-fe852553696a','fe0acdeccf1e8d6a49306c1f9d397d87c8029863b5c411a04342bf7884477cb9',1740224290852,'20250130122319_add_transactions',NULL,NULL,1740224290768,1);
INSERT INTO _prisma_migrations VALUES('7991421c-8ff0-46d7-a4db-4272d5cfb775','ca817586d39e2925d13c1f4b3070fd56b9eadefebcbf1d395796eff3bf6a2e0e',1740224291054,'20250130122542_update_transactions',NULL,NULL,1740224290884,1);
INSERT INTO _prisma_migrations VALUES('2f1a5bab-96e2-4e81-a48e-691a8a3dc0ee','0b678f4591efc7b63fb33370ea4141242d99e57cfbe84e6cc9ae4575b79031aa',1740224291250,'20250130122944_add',NULL,NULL,1740224291081,1);
INSERT INTO _prisma_migrations VALUES('051d2b96-662b-4d81-aa65-0b079e51f035','a6cf280fa71a7316df198360bdd78bb2c644b8b8c6633904dc04f7de017395eb',1740224291665,'20250201064540_add_credit_table',NULL,NULL,1740224291277,1);
INSERT INTO _prisma_migrations VALUES('80a06402-fbe8-48de-bc94-536da7c503b2','036234a687cecadc8c3af2cf2b8c48ffd013a2b6728748ecfc44b631b745e8ed',1740224291775,'20250201131421_add_credit_transactions',NULL,NULL,1740224291692,1);
INSERT INTO _prisma_migrations VALUES('0d1c7641-c750-49cc-a55c-6fd0c27ee252','056cdd8c044a87af1756131661fca87877cda98eda96bf0c25256e0fd7dd28ae',1740224291969,'20250201132048_add_paymentref',NULL,NULL,1740224291803,1);
INSERT INTO _prisma_migrations VALUES('44417538-a41d-4492-b2a6-09c54e2b3019','37d89b09c687f4ae799ed04627e1c885018ea47ab0e43601763e9bae56ef4e91',1740224292110,'20250203195711_add_logo',NULL,NULL,1740224291996,1);
INSERT INTO _prisma_migrations VALUES('caa75f53-5ce8-488a-bfe5-5a60f146a78e','826e6ac2975a7c2092a958988e2a8fe4bd75561495a042b5d85a375f3bc8bac9',1740224292220,'20250206083729_add_address',NULL,NULL,1740224292137,1);
INSERT INTO _prisma_migrations VALUES('6e782f66-b608-4d66-a542-2273bbe25b9c','0502b6823794a9e78d62dfb651d2647537faee8b7c90089dea1fc0005fd746f6',1740224292327,'20250210113019_add_usernote',NULL,NULL,1740224292247,1);
INSERT INTO _prisma_migrations VALUES('05d05189-2c4e-4056-950d-023fe6d9eac4','c450add4493ee6523c5b42bb47e0c03a4520a1d09e92c55ee82944a461c57854',1740224292523,'20250210115124_update_usernotes',NULL,NULL,1740224292354,1);
INSERT INTO _prisma_migrations VALUES('3e5b7184-0bdb-49e1-8d8a-a049e0658fc3','e21df8d311666fb1dfd83b7c5c6fbe22b9c8157b0a5568143a84a6ca5d73caa4',1740224292660,'20250211080120_add_message',NULL,NULL,1740224292551,1);
INSERT INTO _prisma_migrations VALUES('52ee582c-da61-4dfb-a57b-5a570aae6123','18b82076b1bb4c977a3be0f67b4122879e06138310e65ac32b812bad5c58cab9',1740224292857,'20250211113130_add_affiliateid',NULL,NULL,1740224292687,1);
INSERT INTO _prisma_migrations VALUES('9a7e6d58-21d9-4c06-a93b-611c86997420','3b32100715c5d2e2822b73d09c8848fb07477affbc57721dfa87538719b682f7',1740224293083,'20250211163751_add_usergroup',NULL,NULL,1740224292885,1);
INSERT INTO _prisma_migrations VALUES('ba40635a-9ae1-4cbb-91dc-e5fc4b26dc29','5602e9f5954c25f86792c854f372b54f08947bbdb8dac53af65dca2ce425e0bf',1740224293281,'20250211183008_add_type',NULL,NULL,1740224293110,1);
INSERT INTO _prisma_migrations VALUES('a4b6431c-8335-4f90-b78a-3c7782779bdb','819986fb623e02cfbbd544480f22876afef73eb4737327a25a639a86b9bdc9db',1740224293419,'20250213113216_add_contract_tables',NULL,NULL,1740224293308,1);
INSERT INTO _prisma_migrations VALUES('16589fb5-425f-409d-8445-7a6e2b0d6e4b','95f262325ee699e3bcc2f1695df80946c3fd09528d9442b01211ad153f7fe3d1',1740224293753,'20250213133145_add_contract_tables',NULL,NULL,1740224293446,1);
INSERT INTO _prisma_migrations VALUES('f47be5f1-8e36-40ec-aa14-148eb8b2a110','ae8ebede004a8d121e3e1bc7f92996d5b184994c6f8d132072d1b69646a65442',1740224293865,'20250213141529_add_contract_tables',NULL,NULL,1740224293780,1);
INSERT INTO _prisma_migrations VALUES('e4833d19-e43f-47e9-92e2-a2a47f1f43df','763517516d13810f598511b508323847f47058c4378d7c214610994def9bcbf5',1740224294063,'20250213172335_add_contract_tables',NULL,NULL,1740224293892,1);
INSERT INTO _prisma_migrations VALUES('b64d44ff-913a-431c-8fee-4e7f14d275c3','620201fb9fc01903e9fdf04f0e6b82bc51c2ac1aab13a29f99ce12817fd1cf0f',1740224294261,'20250213172935_remove_affiliate_id',NULL,NULL,1740224294090,1);
INSERT INTO _prisma_migrations VALUES('076c804d-b793-4f71-86b0-0a1cad3b3e3c','aac23760ca32ad1593d9bc3645553519d2a75b5dd1431646ca968bb10d461b7d',1740224294456,'20250217135519_add_active',NULL,NULL,1740224294288,1);
INSERT INTO _prisma_migrations VALUES('9f23815f-5fb2-4493-bb35-e28291ef5992','4319bd1ce52d2fa9f7a5b999812c135aaa9e01ce41ac60ccfafaad2ae6aee785',1740224294680,'20250217175931_remove_credit_transactions',NULL,NULL,1740224294488,1);
INSERT INTO _prisma_migrations VALUES('0cbbbbe0-1e7e-4202-896e-1379b0d67d6a','8b8ef52d299183bffbecb10a96c6afb964af42b640ea44d6ee009f971f58736f',1740224294879,'20250217181423_a',NULL,NULL,1740224294707,1);
INSERT INTO _prisma_migrations VALUES('5c99a26f-b75e-491b-b09a-a611edb4c42a','935dade719dbcf7ceb4315aa4789d1729b976d129f88bf19996a5683a8e4cbc4',1740224295100,'20250217184138_add_decrease',NULL,NULL,1740224294910,1);
INSERT INTO _prisma_migrations VALUES('f1765dca-cce6-4023-bc17-a90f1bae1ac3','5acc14cb8f9fe841e02897ac7ac6fd70af4296dd1a6eca73477e602a5e3ff308',1740224295323,'20250219141614_add_plans',NULL,NULL,1740224295131,1);
INSERT INTO _prisma_migrations VALUES('52c6a38f-fabf-4afc-8719-3d3ad70b4f7d','cbc256fd94c0d5d930e95a00f5463523e5cbe3676dd69c9f5b8337567d8a065c',1740224295548,'20250219141845_asd',NULL,NULL,1740224295355,1);
INSERT INTO _prisma_migrations VALUES('6cd1fc31-c767-448c-8306-1b45f14e2f09','39e93f43184e029a08829d30e5199b9dfcc0783324faef18b4958c5c044dfa29',1740224295803,'20250221122530_add_affiliate_id',NULL,NULL,1740224295580,1);
INSERT INTO _prisma_migrations VALUES('cfe97325-8338-47f8-b90d-5cce159989da','a34327a1bc33aa9bc5e7a0f19bedce25a7e1a31ff6ce7848b487e53d88fb58dc',1740224295926,'20250222113050_add_paymentholiday',NULL,NULL,1740224295835,1);
INSERT INTO _prisma_migrations VALUES('b3c541c3-7c7d-4e80-ba74-7a00c28225a7','e0a152af310fabd54073fe189a76f5bd7865de0300e8910c89991853b9183264',1740224296545,'20250222113711_add_int',NULL,NULL,1740224295961,1);
INSERT INTO _prisma_migrations VALUES('aa692abb-cefc-4575-b25d-4f8762bf8c72','9ce2de3436a40d7fb6115f29c4ae01192e6e46efbd90549b997591b3196680b3',1737546150659,'20250122114230_init',NULL,NULL,1737546150542,1);
INSERT INTO _prisma_migrations VALUES('ead43620-7e0c-4234-be74-ad581dd8d5dd','14d791849f1bf18c8c499144ad5969289bfb309fe734874f47b9b151b19e7264',1737553403821,'20250122134323_add_affiliate',NULL,NULL,1737553403575,1);
INSERT INTO _prisma_migrations VALUES('d8077884-7c3c-483e-94bc-0e903177d724','0618d559d4b49f1783cefc223ce0015c5b7b05fd87275fc6867612b7345bdad6',1737575489055,'20250122195128_add_tables',NULL,NULL,1737575488344,1);
INSERT INTO _prisma_migrations VALUES('4a9b071d-c28a-417b-89c2-46a61d170547','e818f79138ecf76a8090c9482ce3f3d4b537d2f4142192060ee85da8d26a95cf',1737885855572,'20250126100415_add_unique',NULL,NULL,1737885855470,1);
INSERT INTO _prisma_migrations VALUES('cebd2d82-b29d-483f-a7fe-2b1d3d1c8280','7836fb7852e1cf9423a47638fc6fb5749841ca60c6307a778898111b01e0170b',1738095805946,'20250128202325_add_labels',NULL,NULL,1738095805601,1);
INSERT INTO _prisma_migrations VALUES('062b469b-e0bf-4ecd-a95b-2dbc0831d925','fe0acdeccf1e8d6a49306c1f9d397d87c8029863b5c411a04342bf7884477cb9',1738239799860,'20250130122319_add_transactions',NULL,NULL,1738239799772,1);
INSERT INTO _prisma_migrations VALUES('624432e1-3c84-44ae-8fd3-7d2022c0b976','ca817586d39e2925d13c1f4b3070fd56b9eadefebcbf1d395796eff3bf6a2e0e',1738239942561,'20250130122542_update_transactions',NULL,NULL,1738239942346,1);
INSERT INTO _prisma_migrations VALUES('656a5eec-94ab-4fa6-a7c4-5b3606d7d085','0b678f4591efc7b63fb33370ea4141242d99e57cfbe84e6cc9ae4575b79031aa',1738240184282,'20250130122944_add',NULL,NULL,1738240184072,1);
INSERT INTO _prisma_migrations VALUES('1eb7de01-a19b-4407-92cc-948a271786b3','a6cf280fa71a7316df198360bdd78bb2c644b8b8c6633904dc04f7de017395eb',1738392341375,'20250201064540_add_credit_table',NULL,NULL,1738392340975,1);
INSERT INTO _prisma_migrations VALUES('feda6cda-492c-454b-8a45-d1f172d4af05','036234a687cecadc8c3af2cf2b8c48ffd013a2b6728748ecfc44b631b745e8ed',1738415661822,'20250201131421_add_credit_transactions',NULL,NULL,1738415661714,1);
INSERT INTO _prisma_migrations VALUES('543c6c24-feeb-44b6-8c24-247af38ea2e9','056cdd8c044a87af1756131661fca87877cda98eda96bf0c25256e0fd7dd28ae',1738416048849,'20250201132048_add_paymentref',NULL,NULL,1738416048676,1);
INSERT INTO _prisma_migrations VALUES('39a60fb4-64aa-4396-9621-f218c112b4c0','37d89b09c687f4ae799ed04627e1c885018ea47ab0e43601763e9bae56ef4e91',1738612631623,'20250203195711_add_logo',NULL,NULL,1738612631500,1);
INSERT INTO _prisma_migrations VALUES('6199614c-9d30-4009-8a89-808ae4a5f928','826e6ac2975a7c2092a958988e2a8fe4bd75561495a042b5d85a375f3bc8bac9',1738831049663,'20250206083729_add_address',NULL,NULL,1738831049567,1);
INSERT INTO _prisma_migrations VALUES('8142cffc-4af5-46b0-99e0-eafb8c097339','0502b6823794a9e78d62dfb651d2647537faee8b7c90089dea1fc0005fd746f6',1739187019395,'20250210113019_add_usernote',NULL,NULL,1739187019319,1);
INSERT INTO _prisma_migrations VALUES('512092aa-8366-428c-96b3-2c12aa7db47f','c450add4493ee6523c5b42bb47e0c03a4520a1d09e92c55ee82944a461c57854',1739188284467,'20250210115124_update_usernotes',NULL,NULL,1739188284300,1);
INSERT INTO _prisma_migrations VALUES('cb3bc635-7e28-4b6c-bad6-34ecbb372e4a','e21df8d311666fb1dfd83b7c5c6fbe22b9c8157b0a5568143a84a6ca5d73caa4',1739260880824,'20250211080120_add_message',NULL,NULL,1739260880703,1);
INSERT INTO _prisma_migrations VALUES('b3a77535-271c-4cb5-be38-14489300135f','18b82076b1bb4c977a3be0f67b4122879e06138310e65ac32b812bad5c58cab9',1739273490808,'20250211113130_add_affiliateid',NULL,NULL,1739273490625,1);
INSERT INTO _prisma_migrations VALUES('f1413b67-e962-4b0c-9674-fae4a8c40afa','3b32100715c5d2e2822b73d09c8848fb07477affbc57721dfa87538719b682f7',1739291871674,'20250211163751_add_usergroup',NULL,NULL,1739291871482,1);
INSERT INTO _prisma_migrations VALUES('560c7d54-567f-4bcb-b5da-139ae6b1ea35','5602e9f5954c25f86792c854f372b54f08947bbdb8dac53af65dca2ce425e0bf',1739298608984,'20250211183008_add_type',NULL,NULL,1739298608784,1);
INSERT INTO _prisma_migrations VALUES('50b175f9-3af5-437f-8be6-5248dfc7b90f','819986fb623e02cfbbd544480f22876afef73eb4737327a25a639a86b9bdc9db',1739446336902,'20250213113216_add_contract_tables',NULL,NULL,1739446336785,1);
INSERT INTO _prisma_migrations VALUES('662916cf-52f4-41c3-94dc-13c04032f409','95f262325ee699e3bcc2f1695df80946c3fd09528d9442b01211ad153f7fe3d1',1739453505396,'20250213133145_add_contract_tables',NULL,NULL,1739453505080,1);
INSERT INTO _prisma_migrations VALUES('a43d69ab-ba49-4c86-8ccc-70fc153b4f9a','ae8ebede004a8d121e3e1bc7f92996d5b184994c6f8d132072d1b69646a65442',1739456129542,'20250213141529_add_contract_tables',NULL,NULL,1739456129445,1);
INSERT INTO _prisma_migrations VALUES('e960d679-fcdd-421c-bbbb-4e9b52b3a13d','763517516d13810f598511b508323847f47058c4378d7c214610994def9bcbf5',1739467415606,'20250213172335_add_contract_tables',NULL,NULL,1739467415432,1);
INSERT INTO _prisma_migrations VALUES('0062164c-0e1f-4876-9d44-e444249c953c','620201fb9fc01903e9fdf04f0e6b82bc51c2ac1aab13a29f99ce12817fd1cf0f',1739467775854,'20250213172935_remove_affiliate_id',NULL,NULL,1739467775681,1);
INSERT INTO _prisma_migrations VALUES('61660f67-e19f-4be5-969e-adfe1cf8043f','aac23760ca32ad1593d9bc3645553519d2a75b5dd1431646ca968bb10d461b7d',1739800520017,'20250217135519_add_active',NULL,NULL,1739800519830,1);
INSERT INTO _prisma_migrations VALUES('f1bcd1d4-47b3-49cc-a01b-81aedc101ec6','4319bd1ce52d2fa9f7a5b999812c135aaa9e01ce41ac60ccfafaad2ae6aee785',1739815171914,'20250217175931_remove_credit_transactions',NULL,NULL,1739815171715,1);
INSERT INTO _prisma_migrations VALUES('f0d840ac-5a65-44f6-b88b-4df600330200','8b8ef52d299183bffbecb10a96c6afb964af42b640ea44d6ee009f971f58736f',1739816063211,'20250217181423_a',NULL,NULL,1739816063041,1);
INSERT INTO _prisma_migrations VALUES('8f12630a-ce1b-4a7f-94ca-3168169b66b3','935dade719dbcf7ceb4315aa4789d1729b976d129f88bf19996a5683a8e4cbc4',1739817698759,'20250217184138_add_decrease',NULL,NULL,1739817698584,1);
INSERT INTO _prisma_migrations VALUES('783853eb-2997-4f17-9e76-7d80de7071dd','5acc14cb8f9fe841e02897ac7ac6fd70af4296dd1a6eca73477e602a5e3ff308',1739974574263,'20250219141614_add_plans',NULL,NULL,1739974574086,1);
INSERT INTO _prisma_migrations VALUES('54d17e1e-d70f-4f56-9d79-09a97dc2f734','cbc256fd94c0d5d930e95a00f5463523e5cbe3676dd69c9f5b8337567d8a065c',1739974725675,'20250219141845_asd',NULL,NULL,1739974725499,1);
INSERT INTO _prisma_migrations VALUES('d6320a93-4d8d-4681-a338-f71b1a5a2654','39e93f43184e029a08829d30e5199b9dfcc0783324faef18b4958c5c044dfa29',1740140730957,'20250221122530_add_affiliate_id',NULL,NULL,1740140730755,1);
INSERT INTO _prisma_migrations VALUES('6f09432b-9a48-4f9c-a37b-ae3e0c1b5f53','e61b99dc742db6073e7e6ad92a43649e59f97b675090d08536f8f8063d88b053',1740225146514,'20250222115226_add_accepted',NULL,NULL,1740225146338,1);
INSERT INTO _prisma_migrations VALUES('29f14b5d-5777-40ea-ac44-ace474b4dd6f','034467f62ea1826bb63de9fccfbc15d5c7d0d209239774e04666a6dbee84b222',1740225233755,'20250222115353_add_reason',NULL,NULL,1740225233651,1);
INSERT INTO _prisma_migrations VALUES('89267a90-e476-4312-b97e-26d4a3779844','e246f22ad166b911163fb6802e69b853e370786bf2fb76343ff52635cc03bdb3',1740226834877,'20250222122034_remove_default',NULL,NULL,1740226834707,1);
INSERT INTO _prisma_migrations VALUES('dc89738e-66e6-4337-9e3b-a360335ca152','903ac80d44b3879c94de91b85ca1e7a58efdc60d3be85a2cbc22b6750b9d0952',1740226886121,'20250222122125_add_pengind',NULL,NULL,1740226885924,1);
INSERT INTO _prisma_migrations VALUES('a47610a8-917a-4019-8da9-6470fc9d1bf3','371b3eb6dd4c7b1b5c9a9abcef46b4866cc85bafb4b2da362a3f7c51c31131bc',1740227924078,'20250222123843_add_fee',NULL,NULL,1740227923970,1);
INSERT INTO _prisma_migrations VALUES('8d90360c-7247-4753-a2de-24a264baae42','c3155c5a0a7f509f12ac59ce5cd9c93e88868f8da6674902a9f9cca8b3d506ca',1740340772384,'20250223195932_add_contract_id',NULL,NULL,1740340772187,1);
INSERT INTO _prisma_migrations VALUES('630ca4aa-e009-4054-8b18-28f36bb38d0e','a41c476de9628dd6246de247368a9cc45935728ccd607fe8f4dd5a7aeb3a6c44',1740340925712,'20250223200205_contract_id',NULL,NULL,1740340925539,1);
INSERT INTO _prisma_migrations VALUES('46061709-64a8-4669-8650-f143a53f634b','c3fecd8c04f1dedfc709f758a884b7f0288a1ce381f0f05d67daaca99ed15010',1740343141610,'20250223203901_add_canregister',NULL,NULL,1740343141431,1);
INSERT INTO _prisma_migrations VALUES('a50e5e09-0dff-48cc-9b49-fc00e94666d8','e9f9bfc26944bf2cfd8401a0e0f6e12e2788fcebc03f8aed46f0dfcd4a1218ae',1740477946011,'20250225100545_add_terms',NULL,NULL,1740477945819,1);
INSERT INTO _prisma_migrations VALUES('e0587f0d-4bac-4c76-95ea-2812f6643809','7ab894313a97b6eb1b765bd353253cd76be37bd926bee8e6a75f256473c140d5',1740643195128,'20250227075954_add_af_id',NULL,NULL,1740643194926,1);
INSERT INTO _prisma_migrations VALUES('be29adcc-dbc0-4c2e-bd98-9058b58cf61d','cee312e181f4a9761abe8d204941751882b6583523c27d53201b3d581d109492',1740649734313,'20250227094854_add_apitables',NULL,NULL,1740649734229,1);
INSERT INTO _prisma_migrations VALUES('23ca3dde-06ed-469d-8e11-995b7c15b669','4ccae33ac6d2ad4ff3e2af3c67fd665c2dcc044362534ed09249ab6d4afc11c2',1740654571292,'20250227110931_add_payment_metadata',NULL,NULL,1740654571183,1);
INSERT INTO _prisma_migrations VALUES('24948f48-8a12-43e3-9c2b-6b28f26efa33','73938c10914184f61271eb9064a130a559eead084f16e37b9ea244e6a91aee68',1740657517552,'20250227115837_add_payment_metadata',NULL,NULL,1740657517332,1);
INSERT INTO _prisma_migrations VALUES('cd6d7d0f-d934-4a7f-bd7c-8c3bdf521c59','ea85fbabb6f2cd85ef023341cf90320bbdaa53de5214ee2ce8a39c90eb315a87',1740896808010,'20250302062647_add_month',NULL,NULL,1740896807834,1);
INSERT INTO _prisma_migrations VALUES('66b97a18-ad06-4f5b-8c26-6348cc0a5a98','ec0afe71dce7b5d5af2437e05369b678f11c253bfa92b3a39dd6adfc634d3e35',1740898318167,'20250302065157_add_ispaymentholiday',NULL,NULL,1740898317964,1);
INSERT INTO _prisma_migrations VALUES('ec0e0de7-5b83-4524-8f4e-f0f3125ca8c6','b49191506995f11329e7aa761a426c04e5018facbc5aa689e2fd303db360f3ca',1740906518226,'20250302090838_add_waitlist',NULL,NULL,1740906518094,1);
INSERT INTO _prisma_migrations VALUES('58bbdc7e-c1bb-44e2-8bb2-37ab42738f1c','9f54ee513682e91a2a3b59edfd3f3095b807c66c292714e88cba6c526ebf2fd4',1740906798102,'20250302091317_add_waitlist',NULL,NULL,1740906797858,1);
INSERT INTO _prisma_migrations VALUES('285ee688-0cb5-4c65-9b54-daac4de04f58','9d80a36ee6e4c32731dee4efdc46978dcd9311d3d854521dfd0699986fd4439f',1740918906183,'20250302123505_add_waitlist',NULL,NULL,1740918905927,1);
INSERT INTO _prisma_migrations VALUES('86df5b04-e5d0-4738-b91c-82dd68b51686','541505f430571744dff9fbace7d7ffed0bb10fc634a04256bf610600570dbbf2',1740939110499,'20250302181150_add_planname',NULL,NULL,1740939110327,1);
INSERT INTO _prisma_migrations VALUES('4d98fdd2-0d59-486b-96f4-e260c0e75933','c08b648bf0ee410a224fa9c215f045adc26609f8c5a947c362cdca9858abcdc4',1740939213854,'20250302181333_add_planname',NULL,NULL,1740939213629,1);
INSERT INTO _prisma_migrations VALUES('e7db20ba-a602-4184-8bdf-0502d59c91bf','448889fd368a3454898f8c12e747ae02fa87fc617a2555b2f5594ad07338f4a2',1740939341143,'20250302181540_add_planname',NULL,NULL,1740939340964,1);
INSERT INTO _prisma_migrations VALUES('92d4c200-a7b2-42d8-8be0-e4fde35d70bd','2bebc36721962856d404923d32ab8da8a467a42ffde9dac821968c86ef0d1847',1741501899675,'20250309063139_add_subdomain',NULL,NULL,1741501899560,1);
CREATE TABLE IF NOT EXISTS "Training" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "type" TEXT NOT NULL,
    "wodName" TEXT,
    "wodType" TEXT,
    "date" DATETIME,
    "score" TEXT,
    "userId" INTEGER NOT NULL,
    CONSTRAINT "Training_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO Training VALUES(1,'Weightlifting',NULL,NULL,1737504000000,NULL,1);
INSERT INTO Training VALUES(2,'WOD','sa','For Time',1736985600000,'22s',1);
INSERT INTO Training VALUES(3,'WOD','AMANDA','For Time',1737590400000,'2',1);
INSERT INTO Training VALUES(4,'WOD','AMANDA222','For Time',1706313600000,'12',5);
INSERT INTO Training VALUES(5,'Weightlifting',NULL,NULL,1738022400000,NULL,5);
INSERT INTO Training VALUES(6,'Cardio',NULL,NULL,1738108800000,NULL,5);
INSERT INTO Training VALUES(7,'Other',NULL,NULL,1738195200000,NULL,5);
INSERT INTO Training VALUES(8,'WOD','AMANDA','For Time',1738195200000,'2',1);
INSERT INTO Training VALUES(9,'WOD','ASD','EMOM',1738713600000,'ASD',5);
INSERT INTO Training VALUES(10,'WOD','KELLIKAS','EMOM',1741275000000,'12',5);
CREATE TABLE IF NOT EXISTS "Exercise" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "exerciseData" TEXT NOT NULL,
    "trainingId" INTEGER NOT NULL,
    CONSTRAINT "Exercise_trainingId_fkey" FOREIGN KEY ("trainingId") REFERENCES "Training" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO Exercise VALUES(2,'sa',1);
INSERT INTO Exercise VALUES(5,'jump',3);
INSERT INTO Exercise VALUES(6,'sas',2);
INSERT INTO Exercise VALUES(8,'jump',4);
INSERT INTO Exercise VALUES(10,'122',5);
INSERT INTO Exercise VALUES(12,'asdasd',6);
INSERT INTO Exercise VALUES(14,'asdfasdf',7);
INSERT INTO Exercise VALUES(15,'jump',8);
INSERT INTO Exercise VALUES(16,'ASD',9);
INSERT INTO Exercise VALUES(19,replace('For load:\nEMOM 12:\n3 power cleans2\n2 hang power cleans\n1 push jerk\n– Build in load.\n\nPost-workout\nOn an 8:00 clock:\nRow, bike, or ski','\n',char(10)),10);
CREATE TABLE IF NOT EXISTS "Record" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "type" TEXT,
    "name" TEXT,
    "date" DATETIME,
    "score" TEXT,
    "weight" REAL,
    "time" TEXT,
    "userId" INTEGER NOT NULL,
    CONSTRAINT "Record_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO Record VALUES(1,'WOD','Helen',1736985600000,'5',NULL,NULL,1);
INSERT INTO Record VALUES(2,'WOD','sa',1736985600000,'22s',NULL,NULL,1);
INSERT INTO Record VALUES(4,'WOD','test',1738540800000,'12',NULL,NULL,5);
INSERT INTO Record VALUES(5,'Weightlifting','test',1737936000000,NULL,22.0,NULL,5);
INSERT INTO Record VALUES(6,'Cardio','aaa',1737936000000,NULL,NULL,'22:22',5);
INSERT INTO Record VALUES(7,'WOD','abc',1740009600000,'12',NULL,NULL,5);
INSERT INTO Record VALUES(8,'WOD','test',1740700800000,'22',NULL,NULL,5);
INSERT INTO Record VALUES(9,'WOD','as',1738627200000,'22:22',NULL,NULL,5);
INSERT INTO Record VALUES(10,'WOD','test',1738800000000,'11',NULL,NULL,5);
INSERT INTO Record VALUES(11,'WOD','test',1738713600000,'33',NULL,NULL,5);
INSERT INTO Record VALUES(12,'WOD','test',1738627200000,'11',NULL,NULL,5);
INSERT INTO Record VALUES(13,'WOD','test',1738540800000,NULL,NULL,NULL,5);
INSERT INTO Record VALUES(14,'WOD','test',1738454400000,'12',NULL,NULL,5);
INSERT INTO Record VALUES(15,'WOD','test',1739491200000,'22',NULL,NULL,5);
INSERT INTO Record VALUES(16,'WOD','test',1739836800000,'4',NULL,NULL,5);
INSERT INTO Record VALUES(17,'WOD','test',1739318400000,'22',NULL,NULL,5);
INSERT INTO Record VALUES(18,'WOD','test',1737936000000,'33',NULL,NULL,5);
INSERT INTO Record VALUES(19,'WOD','KELLIKAS',1741275000000,'12',NULL,NULL,5);
CREATE TABLE IF NOT EXISTS "defaultWOD" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "description" TEXT NOT NULL
);
INSERT INTO defaultWOD VALUES(198,'AMANDA','For Time','9-7-5 reps: Muscle-up, Squat Snatch (61/43 kg)');
INSERT INTO defaultWOD VALUES(199,'ANGIE','For Time','100 Pull-ups, 100 Push-ups, 100 Sit-ups, 100 Air Squats');
INSERT INTO defaultWOD VALUES(200,'ANNIE','For Time','50-40-30-20-10 reps: Double-Unders, Sit-ups');
INSERT INTO defaultWOD VALUES(201,'BARBARA','For Time','5 rounds: 20 Pull-ups, 30 Push-ups, 40 Sit-ups, 50 Air Squats; Rest 3 minutes between rounds');
INSERT INTO defaultWOD VALUES(202,'CHELSEA','EMOM','Every minute on the minute for 30 minutes: 5 Pull-ups, 10 Push-ups, 15 Air Squats');
INSERT INTO defaultWOD VALUES(203,'CINDY','AMRAP','20 minutes: 5 Pull-ups, 10 Push-ups, 15 Air Squats');
INSERT INTO defaultWOD VALUES(204,'DIANE','For Time','21-15-9 reps: Deadlifts (102/70 kg), Handstand Push-ups');
INSERT INTO defaultWOD VALUES(205,'ELIZABETH','For Time','21-15-9 reps: Squat Cleans (61/43 kg), Ring Dips');
INSERT INTO defaultWOD VALUES(207,'FRAN','For Time','21-15-9 reps: Thrusters (43/30 kg), Pull-ups');
INSERT INTO defaultWOD VALUES(208,'GRACE','For Time','30 Clean and Jerks (61/43 kg) for time');
INSERT INTO defaultWOD VALUES(210,'ISABEL','For Time','30 Snatches (61/43 kg) for time');
INSERT INTO defaultWOD VALUES(211,'JACKIE','For Time','1000m Row, 50 Thrusters (20/15 kg), 30 Pull-ups');
INSERT INTO defaultWOD VALUES(214,'LINDA','For Time','10-9-8-7-6-5-4-3-2-1 reps: Deadlift (1.5x bodyweight), Bench Press (bodyweight), Clean (0.75x bodyweight)');
INSERT INTO defaultWOD VALUES(217,'NANCY','For Time','5 rounds for time: 400m Run, 15 Overhead Squats (43/30 kg)');
INSERT INTO defaultWOD VALUES(218,'NICOLE','AMRAP','20 minutes: 400m Run, Max Pull-ups. After each run, perform as many Pull-ups as possible until you break, then return to running.');
INSERT INTO defaultWOD VALUES(219,'ABBATE','For Time','Run 1.6 km, 21 Clean and Jerks (70 kg), Run 800 m, 21 Clean and Jerks (70 kg), Run 1.6 km');
INSERT INTO defaultWOD VALUES(220,'ADAMBROWN','For Time','2 Rounds: 24 Deadlifts (134 kg), 24 Box Jumps (61 cm), 24 Wall Ball Shots (9 kg), 24 Bench Presses (88 kg), 24 Box Jumps (61 cm), 24 Wall Ball Shots (9 kg), 24 Cleans (66 kg)');
INSERT INTO defaultWOD VALUES(221,'ADRIAN','For Time','7 Rounds: 3 Forward Rolls, 5 Wall Climbs, 7 Toes-to-Bar, 9 Box Jumps (76 cm)');
INSERT INTO defaultWOD VALUES(222,'ARNIE','For Time','With a single 32 kg kettlebell: 21 Turkish Get-Ups (Right Arm), 50 Swings, 21 Overhead Squats (Left Arm), 50 Swings, 21 Overhead Squats (Right Arm), 50 Swings, 21 Turkish Get-Ups (Left Arm)');
INSERT INTO defaultWOD VALUES(223,'BADGER','For Time','3 Rounds: 30 Squat Cleans (43 kg), 30 Pull-Ups, Run 800 m');
INSERT INTO defaultWOD VALUES(224,'BARAZZA','AMRAP','18 Minutes: Run 200 m, 9 Deadlifts (125 kg), 6 Burpee Bar Muscle-Ups');
INSERT INTO defaultWOD VALUES(225,'BELL','For Time','3 Rounds: 21 Deadlifts (84 kg), 15 Pull-Ups, 9 Front Squats (84 kg)');
INSERT INTO defaultWOD VALUES(226,'BIG SEXY','For Time','5 Rounds: 6 Deadlifts (143 kg), 6 Burpees, 5 Cleans (102 kg), 5 Chest-to-Bar Pull-Ups, 4 Thrusters (70 kg), 4 Muscle-Ups');
INSERT INTO defaultWOD VALUES(227,'BLAKE','For Time','4 Rounds: 30 m Walking Lunge with 20 kg plate held overhead, 30 Box Jumps (61 cm), 20 Wall Ball Shots (9 kg), 10 Handstand Push-Ups');
INSERT INTO defaultWOD VALUES(228,'BOWEN','For Time','3 Rounds: Run 800 m, 7 Deadlifts (125 kg), 10 Burpee Pull-Ups, 14 Single-Arm Kettlebell Thrusters (24 kg, 7 each arm), 20 Box Jumps (61 cm)');
INSERT INTO defaultWOD VALUES(229,'BRADLEY','For Time','10 Rounds: Sprint 100 m, 10 Pull-Ups, Sprint 100 m, 10 Burpees; Rest 30 seconds');
INSERT INTO defaultWOD VALUES(230,'BRADSHAW','For Time','10 Rounds: 3 Handstand Push-Ups, 6 Deadlifts (102 kg), 12 Pull-Ups, 24 Double-Unders');
INSERT INTO defaultWOD VALUES(231,'BREHM','For Time','10 Rope Climbs (4.5 m), 20 Back Squats (102 kg), 30 Handstand Push-Ups, Row 40 Calories');
INSERT INTO defaultWOD VALUES(232,'BRENTON','For Time','5 Rounds: 30 m Bear Crawl, 30 m Standing Broad-Jump; Do 3 Burpees after every 5 Broad-Jumps. If you have a 9 kg vest or body armor, wear it.');
INSERT INTO defaultWOD VALUES(233,'BULL','For Time','2 Rounds: Run 1.6 km, 50 Pull-Ups, 100 Push-Ups, 150 Squats; Wear a 9 kg vest if you have one.');
INSERT INTO defaultWOD VALUES(234,'CAL','For Time','Run 800 m with a 9 kg medicine ball, 80 Squats with medicine ball, 60 Sit-Ups with medicine ball, 40 Push-Ups with medicine ball, Run 800 m with medicine ball');
INSERT INTO defaultWOD VALUES(235,'CARSE','For Time','21-18-15-12-9-6-3 reps: Squat Clean (43 kg), Double-Under, Deadlift (70 kg), Box Jump (61 cm); Begin each round with a 50 m Bear Crawl.');
INSERT INTO defaultWOD VALUES(236,'CHAD','For Time','1,000 Box Step-Ups (51 cm) with a 20 kg rucksack');
INSERT INTO defaultWOD VALUES(237,'CHESTER','For Time','1-2-3-4-5-6-7-8-9-10 reps: Clean (61 kg), Strict Handstand Push-Up');
INSERT INTO defaultWOD VALUES(238,'CHRIS','For Time','5 Rounds: 15 GHD Sit-Ups, 15 Back Extensions, 15 Knees-to-Elbows, 15 Toes-to-Bar');
INSERT INTO defaultWOD VALUES(239,'CLARK','For Time','3 Rounds: 155 Squats, 10 Meter Hill Sprint (20 m elevation), 10 Rope Climbs (4.5 m)');
INSERT INTO defaultWOD VALUES(240,'CLIFFORD','For Time','6 Rounds: 3 Deadlifts (143 kg), 3 Rope Climbs (4.5 m), 3 Handstand Push-Ups; If you have a 9 kg vest or body armor, wear it.');
INSERT INTO defaultWOD VALUES(241,'CLOVIS','For Time','Run 16 km, 150 Burpee Pull-Ups; Partition the run and burpee pull-ups as needed. If you have a 9 kg vest or body armor, wear it.');
INSERT INTO defaultWOD VALUES(242,'COE','For Time','10 Rounds: 10 Thrusters (43 kg), 10 Ring Push-Ups');
INSERT INTO defaultWOD VALUES(243,'COLLIN','For Time','6 Rounds: Carry 22.5 kg dumbbells 180 m, 50 Push-Ups, Carry 22.5 kg dumbbells 180 m, 50 Squats; If you have a 9 kg vest or body armor, wear it.');
INSERT INTO defaultWOD VALUES(244,'COLOMBIA','For Time','5 Rounds: 800 m Run, 200 m Dumbbell Farmers Carry (22.5 kg), 50 Push-Ups');
INSERT INTO defaultWOD VALUES(245,'COOPER','For Time','10 Rounds: 10 Burpees, 10 Squats, 10 Push-Ups; Rest 2 minutes between rounds.');
INSERT INTO defaultWOD VALUES(246,'CROCKETT','For Time','10-9-8-7-6-5-4-3-2-1 reps: Squat Clean (70 kg), Double-Under, Deadlift (102 kg), Box Jump (61 cm); Begin each round with a 50 m Bear Crawl.');
INSERT INTO defaultWOD VALUES(247,'CURTIS P','For Time','100 reps of: 1 Power Clean (43 kg), 1 Lunge (Left Leg), 1 Lunge (Right Leg), 1 Push Press');
INSERT INTO defaultWOD VALUES(248,'DANNY','AMRAP','20 Minutes: 30 Box Jumps (61 cm), 20 Push Presses (53kg/35kg), 30 pull ups');
INSERT INTO defaultWOD VALUES(249,'DANIEL','For Time','50 Pull-Ups, 400 meter Run, 21 Thrusters (43 kg), 800 meter Run, 21 Thrusters (43 kg), 400 meter Run, 50 Pull-Ups');
INSERT INTO defaultWOD VALUES(250,'DEL','For Time','25 Burpees, Run 400 meters with a 20 kg plate, 25 Weighted Pull-Ups with a 20 kg plate, Run 400 meters with a 20 kg plate, 25 Handstand Push-Ups');
INSERT INTO defaultWOD VALUES(251,'DEMETRI','For Time','21-15-9 reps: Deadlifts (102 kg), Box Jumps (61 cm), Clean-and-Jerks (61 kg)');
INSERT INTO defaultWOD VALUES(252,'DGB','For Time','8 Rounds: 200 meter Run, 10 meter Rope Climb, 1 Muscle-Up');
INSERT INTO defaultWOD VALUES(253,'DONNY','For Time','21-15-9-9-15-21 reps: Deadlifts (102 kg), Burpees');
INSERT INTO defaultWOD VALUES(254,'DORK','For Time','6 Rounds: 60 Double-Unders, 30 Kettlebell Swings (24 kg), 15 Burpees');
INSERT INTO defaultWOD VALUES(255,'DT','For Time','5 Rounds: 12 Deadlifts (70 kg), 9 Hang Power Cleans (70 kg), 6 Push Jerks (70 kg)');
INSERT INTO defaultWOD VALUES(256,'DUNN','For Time','3 Rounds: 15 Muscle-Ups, 7 Push Jerks (84 kg), 1000 meter Run');
INSERT INTO defaultWOD VALUES(257,'EVA','For Time','5 Rounds: 800 meter Run, 30 Kettlebell Swings (32 kg), 30 Pull-Ups');
INSERT INTO defaultWOD VALUES(258,'FALKEL','For Time','8 Rounds: 200 meter Run, 2 Rope Climbs');
INSERT INTO defaultWOD VALUES(259,'FELIX','For Time','21-15-9 reps: Deadlifts (102 kg), Box Jumps (61 cm), Clean-and-Jerks (61 kg)');
INSERT INTO defaultWOD VALUES(260,'FIGHT GONE BAD','EMOM','3 Rounds: 1 minute Wall Balls (9 kg), 1 minute Sumo Deadlift High-Pulls (35 kg), 1 minute Box Jumps (61 cm), 1 minute Push Presses (35 kg), 1 minute Row (calories), 1 minute Rest');
INSERT INTO defaultWOD VALUES(261,'FILTHY 50','For Time','50 Box Jumps (61 cm), 50 Jumping Pull-Ups, 50 Kettlebell Swings (16 kg), 50 Walking Lunges, 50 Knees-to-Elbows, 50 Push Presses (20 kg), 50 Back Extensions, 50 Wall Ball Shots (9 kg), 50 Burpees, 50 Double-Unders');
INSERT INTO defaultWOD VALUES(262,'FORREST','For Time','3 Rounds: 20 L-Pull-Ups, 30 Toes-to-Bar, 40 Burpees, 800 meter Run');
INSERT INTO defaultWOD VALUES(263,'FRANTZ','For Time','21-15-9 reps: Thrusters (43 kg), Pull-Ups');
INSERT INTO defaultWOD VALUES(264,'FRELEN','For Time','5 Rounds: Run 800 meters, 15 Dumbbell Thrusters (22.5 kg), 15 Pull-Ups');
INSERT INTO defaultWOD VALUES(265,'GALLANT','For Time','For Time: 1 mile Run, 60 Burpee Pull-Ups');
INSERT INTO defaultWOD VALUES(266,'GARRETT','For Time','3 Rounds: 800 meter Run, 21 L-Pull-Ups');
INSERT INTO defaultWOD VALUES(267,'GATOR','For Time','8 Rounds: 5 Front Squats (84 kg), 26 Ring Push-Ups');
INSERT INTO defaultWOD VALUES(268,'GLEN','For Time','30 Clean-and-Jerks (61 kg), 1 mile Run, 10 Rope Climbs, 1 mile Run, 100 Burpees');
INSERT INTO defaultWOD VALUES(269,'GRIFF','For Time','Run 800 meters, Run 400 meters backwards, Run 800 meters, Run 400 meters backwards');
INSERT INTO defaultWOD VALUES(270,'GRIFFIN','For Time','800 meter Run, 400 meter Run, 800 meter Run, 400 meter Run');
INSERT INTO defaultWOD VALUES(271,'HAMMER','For Time','5 Rounds: 5 Power Cleans (61 kg), 10 Front Squats (61 kg), 5 Jerks (61 kg), 20 Pull-Ups');
INSERT INTO defaultWOD VALUES(272,'HAMMERTIME','For Time','5 Rounds: 5 Deadlifts (102 kg), 10 Toes-to-Bar, 15 Kettlebell Swings (24 kg)');
INSERT INTO defaultWOD VALUES(273,'HANNAH','For Time','3 Rounds: 800 meter Run, 21 Kettlebell Swings (24 kg), 12 Pull-Ups');
INSERT INTO defaultWOD VALUES(274,'HANSEN','For Time','5 Rounds: 30 Kettlebell Swings (32 kg), 30 Burpees, 30 GHD Sit-Ups');
INSERT INTO defaultWOD VALUES(275,'HARD CINDY','AMRAP','20 Minutes: 5 Pull-Ups, 10 Push-Ups, 15 Air Squats');
INSERT INTO defaultWOD VALUES(277,'HEATHER','For Time','3 Rounds: 200 meter Run, 12 Chest-to-Bar Pull-Ups, 21 Walking Lunges');
INSERT INTO defaultWOD VALUES(278,'HELEN','For Time','3 Rounds: 400 meter Run, 21 Kettlebell Swings (24 kg), 12 Pull-Ups');
INSERT INTO defaultWOD VALUES(279,'HILDY','For Time','100 Calorie Row, 75 Thrusters (20 kg), 50 Pull-Ups, 25 Handstand Push-Ups');
INSERT INTO defaultWOD VALUES(280,'HOLLEYMAN','For Time','30 Rounds: 5 Wall Balls (9 kg), 3 Handstand Push-Ups, 1 Power Clean (84 kg)');
INSERT INTO defaultWOD VALUES(281,'HOLLYMAN','For Time','30 Rounds: 5 Wall Balls (9 kg), 3 Handstand Push-Ups, 1 Power Clean (84 kg)');
INSERT INTO defaultWOD VALUES(282,'HORVATH','For Time','2 Rounds: 5 Wall Climbs, 10 Toes-to-Bar, 50 ft. Overhead Walking Lunge (61 kg), 100 ft. Sprint');
INSERT INTO defaultWOD VALUES(283,'HOTSHOTS 19','For Time','6 Rounds: 30 Air Squats, 19 Power Cleans (61 kg), 7 Strict Pull-Ups, 400 meter Run');
INSERT INTO defaultWOD VALUES(284,'HULK','For Time','5 Rounds: 5 Power Cleans (102 kg), 5 Front Squats (102 kg), 5 Jerks (102 kg), 3 Muscle-Ups');
INSERT INTO defaultWOD VALUES(285,'HUMBERTO','For Time','21-15-9 reps: Overhead Squats (43 kg), Bench Presses (bodyweight)');
INSERT INTO defaultWOD VALUES(286,'JACK','AMRAP','20 Minutes: 10 Push Presses (52 kg), 10 Kettlebell Swings (24 kg), 10 Box Jumps (61 cm)');
INSERT INTO defaultWOD VALUES(287,'JAMES','For Time','5 Rounds: 200 meter Run, 11 Thrusters (61 kg), 200 meter Run, 11 Pull-Ups');
INSERT INTO defaultWOD VALUES(288,'JASON','For Time','100 Squats, 5 Muscle-Ups, 75 Squats, 10 Muscle-Ups, 50 Squats, 15 Muscle-Ups, 25 Squats, 20 Muscle-Ups');
INSERT INTO defaultWOD VALUES(289,'JENNY','AMRAP','20 Minutes: 20 Overhead Squats (43 kg), 20 Back Squats (43 kg), 400 meter Run');
INSERT INTO defaultWOD VALUES(290,'JERRY','For Time','Run 1 mile, 2,000 meter Row, 1 mile Run');
INSERT INTO defaultWOD VALUES(291,'JESSE','For Time','3 Rounds: 1 minute Handstand Hold, 100 ft. Walking Lunge, 100 ft. Bear Crawl');
INSERT INTO defaultWOD VALUES(292,'JESSICA','For Time','800 meter Run, 21 Deadlifts (102 kg), 21 Handstand Push-Ups, 800 meter Run, 15 Deadlifts (102 kg), 15 Handstand Push-Ups, 800 meter Run, 9 Deadlifts (102 kg), 9 Handstand Push-Ups');
INSERT INTO defaultWOD VALUES(293,'JOSH','For Time','21 Overhead Squats (43 kg), 42 Pull-Ups, 15 Overhead Squats (43 kg), 30 Pull-Ups, 9 Overhead Squats (43 kg), 18 Pull-Ups');
INSERT INTO defaultWOD VALUES(294,'JOSHIE','For Time','3 Rounds: 21 Kettlebell Swings (24 kg), 21 Pull-Ups, 800 meter Run');
INSERT INTO defaultWOD VALUES(295,'JT','For Time','21-15-9 reps: Handstand Push-Ups, Ring Dips, Push-Ups');
INSERT INTO defaultWOD VALUES(296,'JUMBO','For Time','5 Rounds: 30 Wall Balls (9 kg), 30 Box Jumps (61 cm), 30 Kettlebell Swings (24 kg)');
INSERT INTO defaultWOD VALUES(297,'KALI','For Time','4 Rounds: 100 ft. Walking Lunge, 30 Sit-Ups, 20 Pull-Ups, 10 Handstand Push-Ups');
INSERT INTO defaultWOD VALUES(298,'KAREN','For Time','150 Wall Balls (9 kg)');
INSERT INTO defaultWOD VALUES(299,'KELLY','For Time','5 Rounds: 400 meter Run, 30 Box Jumps (61 cm), 30 Wall Balls (9 kg)');
INSERT INTO defaultWOD VALUES(300,'KLEPTO','For Time','4 Rounds: 27 Box Jumps (61 cm), 20 Burpees, 11 Squat Cleans (61 kg)');
INSERT INTO defaultWOD VALUES(301,'KYLE','For Time','3 Rounds: 40 Overhead Walking Lunges (20 kg), 30 Box Jumps (61 cm), 20 Wall Balls (9 kg), 10 Handstand Push-Ups');
INSERT INTO defaultWOD VALUES(302,'LUMBERJACK 20','For Time','20 Deadlifts (125 kg), Run 400 meters, 20 Kettlebell Swings (32 kg), Run 400 meters, 20 Overhead Squats (61 kg), Run 400 meters, 20 Burpees, Run 400 meters, 20 Chest-to-Bar Pull-Ups, Run 400 meters, 20 Box Jumps (61 cm), Run 400 meters, 20 Dumbbell Squat Cleans (22.5 kg), Run 400 meters');
INSERT INTO defaultWOD VALUES(303,'LUMBERJACK 9','For Time','9 Rounds: 11 Power Cleans (84 kg), 100 meter Sprint, 12 Pull-Ups');
INSERT INTO defaultWOD VALUES(304,'LYNNE','AMRAP','5 Rounds: Max Reps Bench Press (bodyweight), Max Reps Pull-Ups');
INSERT INTO defaultWOD VALUES(305,'MAGGIE','For Time','5 Rounds: 20 Handstand Push-Ups, 40 Pull-Ups, 60 Pistols');
INSERT INTO defaultWOD VALUES(306,'MANION','For Time','7 Rounds: Run 400 meters, 29 Back Squats (61 kg)');
INSERT INTO defaultWOD VALUES(307,'MANNING','For Time','50-40-30-20-10 reps: Double-Unders, Sit-Ups, Pull-Ups, Push-Ups');
INSERT INTO defaultWOD VALUES(308,'MARGUERITA','For Time','50 reps: Burpee/Push-Up/Jumping-Jack/Sit-Up/Handstand');
INSERT INTO defaultWOD VALUES(309,'MARY','AMRAP','20 Minutes: 5 Handstand Push-Ups, 10 Pistols (alternating legs), 15 Pull-Ups');
INSERT INTO defaultWOD VALUES(310,'MATT 19','For Time','3 Rounds: 400 meter Run, 19 Deadlifts (102 kg), 19 Kettlebell Swings (24 kg)');
INSERT INTO defaultWOD VALUES(311,'MATTY G','For Time','26 Rounds: 5 Pull-Ups, 10 Push-Ups, 15 Air Squats');
INSERT INTO defaultWOD VALUES(312,'McGHEE','For Time','30 minute: 5 Deadlifts (125 kg), 13 Push-Ups, 9 Box Jumps (61 cm)');
INSERT INTO defaultWOD VALUES(313,'MCKEOWN','For Time','4 Rounds: 400 meter Run, 16 Kettlebell Swings (24 kg), 12 Pull-Ups');
INSERT INTO defaultWOD VALUES(314,'MACHO BEAR','For Time','5 Rounds: 3 Power Cleans (84 kg), 3 Front Squats (84 kg), 3 Jerks (84 kg); Rest 3 minutes between rounds.');
INSERT INTO defaultWOD VALUES(315,'MANNY','For Time','5 Rounds: 400 m Run, 13 Toes-to-Bar, 13 Deadlifts (102 kg), 13 Burpees Over the Bar');
INSERT INTO defaultWOD VALUES(316,'MARTIN','For Time','3 Rounds: 800 m Run, 20 Pull-Ups, 30 Kettlebell Swings (24 kg), 40 Air Squats');
INSERT INTO defaultWOD VALUES(317,'MATTHEW','For Time','4 Rounds: 400 m Run, 15 Bench Presses (70 kg), 15 Back Squats (70 kg)');
INSERT INTO defaultWOD VALUES(318,'MCCLAIN','For Time','4 Rounds: 9 Front Squats (84 kg), 15 Kettlebell Swings (32 kg), 21 Box Jumps (61 cm)');
INSERT INTO defaultWOD VALUES(319,'MORRISON','For Time','50-40-30-20-10 reps: Wall Ball Shots (9 kg), Box Jumps (61 cm), Kettlebell Swings (24 kg)');
INSERT INTO defaultWOD VALUES(320,'NATE','AMRAP','20 Minutes: 2 Muscle-Ups, 4 Handstand Push-Ups, 8 Kettlebell Swings (32 kg)');
INSERT INTO defaultWOD VALUES(321,'NED','For Time','7 Rounds: 11 Back Squats (102 kg), 1,000 m Row');
INSERT INTO defaultWOD VALUES(322,'NUTTS','For Time','10 Handstand Push-Ups, 15 Deadlifts (113 kg), 25 Box Jumps (76 cm), 50 Pull-Ups, 100 Wall Ball Shots (9 kg), 400 m Run with 20 kg plate');
INSERT INTO defaultWOD VALUES(323,'PAUL','For Time','5 Rounds: 50 Double-Unders, 35 Knees-to-Elbows, 20 Yard Overhead Walk (43 kg barbell)');
INSERT INTO defaultWOD VALUES(324,'RANDY','For Time','75 Power Snatches (34 kg)');
INSERT INTO defaultWOD VALUES(325,'RILEY','For Time','1.5 mile Run, 150 Burpees, 1.5 mile Run; Wear a 9 kg weight vest if available.');
INSERT INTO defaultWOD VALUES(326,'RJ','For Time','5 Rounds: 800 m Run, 5 Rope Climbs (4.5 m), 50 Push-Ups');
INSERT INTO defaultWOD VALUES(327,'RORY','AMRAP','20 Minutes: 20 Thrusters (43 kg), 20 Alternating Single-Leg Squats, 20 Ring Dips');
INSERT INTO defaultWOD VALUES(332,'WILMOT','For Time','6 Rounds: 50 Air Squats, 25 Ring Dips, 400 m Run');
INSERT INTO defaultWOD VALUES(335,'WITTMAN','For Time','7 Rounds: 15 Kettlebell Swings (24 kg), 15 Power Cleans (43 kg), 15 Box Jumps (61 cm)');
INSERT INTO defaultWOD VALUES(336,'ZACH','For Time','6 Rounds: 6 Squat Snatches (70 kg), 11 Pull-Ups, 6 Thrusters (70 kg), 11 Toes-to-Bar');
INSERT INTO defaultWOD VALUES(337,'ZEMAN','For Time','5 Rounds: 400 m Run, 30 Wall Balls (9 kg), 30 Sumo Deadlift High-Pulls (43 kg)');
INSERT INTO defaultWOD VALUES(338,'ZIMMERMAN','AMRAP','25 Minutes: 11 Chest-to-Bar Pull-Ups, 2 Deadlifts (143 kg), 10 Handstand Push-Ups');
INSERT INTO defaultWOD VALUES(339,'STEPHEN','For Time','30-25-20-15-10-5 reps: GHD Sit-Ups, Back Extensions, Knees-to-Elbows, Sit-Ups');
INSERT INTO defaultWOD VALUES(340,'SANTIAGO','For Time','7 Rounds: 18 Dumbbell Hang Squat Cleans (22.5 kg each), 18 Pull-Ups, 10 Power Cleans (61 kg), 10 Handstand Push-Ups');
INSERT INTO defaultWOD VALUES(341,'SEVERIN','For Time','50 Strict Pull-Ups, 100 Hand-Release Push-Ups, 5 km Run; Wear a 9 kg vest if available.');
INSERT INTO defaultWOD VALUES(342,'SHAM','For Time','7 Rounds: 11 Bodyweight Deadlifts, 100-meter Sprint; Rest 2 minutes between rounds');
INSERT INTO defaultWOD VALUES(343,'SHIP','For Time','9 Rounds: 7 Squat Cleans (84 kg), 8 Burpee Box Jumps (61 cm)');
INSERT INTO defaultWOD VALUES(344,'SIMPSON','AMRAP','20 Minutes: 5 Parallette Handstand Push-Ups, 10 Toes-to-Bar');
INSERT INTO defaultWOD VALUES(345,'SMALL','For Time','3 Rounds: 1,000-meter Row, 50 Burpees, 50 Box Jumps (61 cm), 800-meter Run');
INSERT INTO defaultWOD VALUES(346,'SPEHAR','For Time','100 Thrusters (20 kg), 100 Pull-Ups, 800-meter Weighted Run (20 kg), 100 Handstand Push-Ups, 100 Kettlebell Swings (24 kg), 800-meter Weighted Run (20 kg)');
INSERT INTO defaultWOD VALUES(347,'STONE','For Time','5 Rounds: 30 Push-Ups, 30 Ring Dips, 15-foot Rope Climb, 400-meter Run');
INSERT INTO defaultWOD VALUES(348,'SWARTZ','For Time','5 Rounds: 5 Burpees, 10 Pull-Ups, 20 Push-Ups, 30 Sit-Ups, 400-meter Run');
INSERT INTO defaultWOD VALUES(349,'ZOEY','For Time','3 Rounds: 30 Wall Balls (9 kg), 30 Sumo Deadlift High-Pulls (43 kg), 30 Box Jumps (61 cm)');
INSERT INTO defaultWOD VALUES(350,'TERRY','For Time','1-mile Run, 100 Push-Ups, 100-meter Bear Crawl, 1-mile Run, 100-meter Bear Crawl, 100 Push-Ups, 1-mile Run');
INSERT INTO defaultWOD VALUES(351,'THOMPSON','For Time','10 Rounds: 1 Rope Climb (4.5 m), 29 Back Squats (61 kg), 10-meter Barbell Farmer Carry (61 kg each hand)');
INSERT INTO defaultWOD VALUES(352,'TILLMAN','For Time','7 Rounds: 7 Deadlifts (143 kg), 200-meter Sprint, 15 Pull-Ups, 45-second Rest');
INSERT INTO defaultWOD VALUES(353,'TK','AMRAP','20 Minutes: 8 Strict Pull-Ups, 8 Box Jumps (76 cm), 12 Kettlebell Swings (32 kg)');
INSERT INTO defaultWOD VALUES(354,'TOMMY MAC','For Time','12 Burpees, 12 Thrusters (61 kg), 12 Burpees, 12 Power Snatches (61 kg), 12 Burpees, 12 Push Jerks (61 kg), 12 Burpees, 12 Hang Squat Cleans (61 kg), 12 Burpees, 12 Overhead Squats (61 kg)');
INSERT INTO defaultWOD VALUES(357,'TUMILSON','For Time','8 Rounds: Run 200 meters, 11 Dumbbell Burpee Deadlifts (22.5 kg each)');
INSERT INTO defaultWOD VALUES(359,'RAGNA','For Time','5 Rounds: 400-meter Run, 15 Overhead Squats (43 kg), 15 Pull-Ups');
INSERT INTO defaultWOD VALUES(360,'RAY','For Time','5 Rounds: 225-meter Run, 15 Push-Ups, 15 Overhead Squats (43 kg)');
INSERT INTO defaultWOD VALUES(361,'RICK','For Time','10 Rounds: 10 Deadlifts (102 kg), 20 Push-Ups, 30 Box Jumps (61 cm)');
INSERT INTO defaultWOD VALUES(362,'ROBERT','For Time','6 Rounds: 20 Pull-Ups, 40 Push-Ups, 60 Squats, 800-meter Run');
INSERT INTO defaultWOD VALUES(363,'ROBIN','For Time','4 Rounds: 400-meter Run, 20 Burpees, 20 Kettlebell Swings (24 kg)');
INSERT INTO defaultWOD VALUES(364,'ROCKY','For Time','3 Rounds: 800-meter Run, 30 Kettlebell Swings (24 kg), 30 Box Jumps (61 cm)');
INSERT INTO defaultWOD VALUES(365,'ROGERS','For Time','5 Rounds: 400-meter Run, 15 Deadlifts (102 kg), 15 Pull-Ups');
INSERT INTO defaultWOD VALUES(366,'ROSE','For Time','4 Rounds: 400-meter Run, 20 Thrusters (43 kg), 20 Pull-Ups');
INSERT INTO defaultWOD VALUES(367,'RUDY','For Time','5 Rounds: 400-meter Run, 15 Power Cleans (61 kg), 15 Pull-Ups');
INSERT INTO defaultWOD VALUES(368,'RYAN','For Time','5 Rounds: 7 Muscle-Ups, 21 Burpees; Each burpee terminates with a jump one foot above max standing reach.');
INSERT INTO defaultWOD VALUES(369,'SAGE','For Time','20 Thrusters (43 kg), 20 Pull-Ups, 20 Power Cleans (61 kg), 20 Pull-Ups, 20 Overhead Squats (43 kg), 20 Pull-Ups');
INSERT INTO defaultWOD VALUES(370,'SANTORA','For Time','3 Rounds: 155 Squats, 50 Push-Ups, 155 Walking Lunges, 50 Push-Ups');
INSERT INTO defaultWOD VALUES(371,'SCOTT','For Time','11 Push Presses (52 kg), 50 Double-Unders, 11 Thrusters (52 kg), 50 Double-Unders, 11 Push Presses (52 kg), 50 Double-Unders, 11 Thrusters (52 kg), 50 Double-Unders');
INSERT INTO defaultWOD VALUES(372,'SEAN','For Time','10 Rounds: 11 Chest-to-Bar Pull-Ups, 2 Deadlifts (143 kg), 10 Handstand Push-Ups');
INSERT INTO defaultWOD VALUES(373,'SHAWN','For Time','5 Rounds: 200-meter Run, 11 Bodyweight Back Squats');
INSERT INTO defaultWOD VALUES(374,'SHAY','For Time','5 Rounds: 200-meter Run, 15 Chest-to-Bar Pull-Ups');
INSERT INTO defaultWOD VALUES(375,'SHIVAN','For Time','4 Rounds: 400-meter Run, 15 Deadlifts (102 kg), 15 Pull-Ups');
INSERT INTO defaultWOD VALUES(376,'SMITH','For Time','6 Rounds: 200-meter Run, 3 Deadlifts (143 kg), 10 Toes-to-Bar');
INSERT INTO defaultWOD VALUES(377,'SPEEDY','For Time','5 Rounds: 200-meter Run, 9 Power Cleans (61 kg), 9 Burpees');
INSERT INTO defaultWOD VALUES(378,'SPENCER','For Time','10 Rounds: 100-meter Sprint, 10 Burpees');
INSERT INTO defaultWOD VALUES(379,'STEWART','For Time','5 Rounds: 200-meter Run, 11 Push-Ups, 11 Box Jumps (61 cm)');
INSERT INTO defaultWOD VALUES(380,'STONER','For Time','5 Rounds: 200-meter Run, 10 Push-Ups, 10 Squat Cleans (61 kg)');
INSERT INTO defaultWOD VALUES(381,'STOUT','For Time','5 Rounds: 200-meter Run, 15 Kettlebell Swings (24 kg), 15 Pull-Ups');
INSERT INTO defaultWOD VALUES(382,'TAYLOR','For Time','4 Rounds: 400-meter Run, 5 Burpee Muscle-Ups');
INSERT INTO defaultWOD VALUES(383,'TOM','For Time','7 Rounds: 7 Muscle-Ups, 11 Thrusters (52 kg), 14 Toes-to-Bar');
INSERT INTO defaultWOD VALUES(384,'TOMMY','For Time','21 Thrusters (43 kg), 12 Rope Climbs, 15 Thrusters (43 kg), 9 Rope Climbs, 9 Thrusters (43 kg), 6 Rope Climbs');
INSERT INTO defaultWOD VALUES(385,'TREVOR','For Time','Team of Four: 300 Pull-Ups, 400 Push-Ups, 500 Sit-Ups, 600 Air Squats; Only two athletes can work at a time.');
INSERT INTO defaultWOD VALUES(386,'TULLY','For Time','4 Rounds: 200-meter Swim, 23 Wall Ball Shots (9 kg), 23 Kettlebell Swings (24 kg), 23 Pull-Ups, 23 Burpees');
INSERT INTO defaultWOD VALUES(387,'TYLER','For Time','5 Rounds: 7 Muscle-Ups, 21 Sumo Deadlift High-Pulls (43 kg)');
INSERT INTO defaultWOD VALUES(388,'WALKER','For Time','4 Rounds: 800-meter Run, 400-meter Run with 20-kg plate');
INSERT INTO defaultWOD VALUES(389,'WALLACE','For Time','3 Rounds: 21 Deadlifts (102 kg), 15 Pull-Ups, 9 Overhead Squats (43 kg)');
INSERT INTO defaultWOD VALUES(390,'WELSH','For Time','5 Rounds: 200-meter Run, 10 Overhead Squats (43 kg), 10 Box Jumps (61 cm)');
INSERT INTO defaultWOD VALUES(391,'WHITE','For Time','5 Rounds: 3 Rope Climbs (4.5 m), 10 Toes-to-Bar, 21 Walking Lunges with 32 kg kettlebell');
INSERT INTO defaultWOD VALUES(392,'WILSON','For Time','30 Kettlebell Swings (32 kg), 30 Box Jumps (61 cm), 30 Overhead Squats (43 kg)');
INSERT INTO defaultWOD VALUES(393,'WOOD','5 Rounds for Time','5 Rounds: 400-meter Run, 10 Burpee Box Jumps (61 cm), 10 Sumo Deadlift High-Pulls (43 kg), 10 Thrusters (43 kg), Rest 1 minute');
INSERT INTO defaultWOD VALUES(394,'WOODROW','For Time','5 Rounds: 400-meter Run, 10 Burpee Box Jumps (61 cm), 10 Sumo Deadlift High-Pulls (43 kg), 10 Thrusters (43 kg), Rest 1 minute');
INSERT INTO defaultWOD VALUES(395,'KELLIKAS','EMOM',replace('For load:\nEMOM 12:\n3 power cleans\n2 hang power cleans\n1 push jerk\n– Build in load.\n\nPost-workout\nOn an 8:00 clock:\nRow, bike, or ski','\n',char(10)));
CREATE TABLE IF NOT EXISTS "AffiliateTrainer" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "affiliateId" INTEGER NOT NULL,
    "trainerId" INTEGER NOT NULL,
    CONSTRAINT "AffiliateTrainer_affiliateId_fkey" FOREIGN KEY ("affiliateId") REFERENCES "Affiliate" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "AffiliateTrainer_trainerId_fkey" FOREIGN KEY ("trainerId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO AffiliateTrainer VALUES(8,1,1);
INSERT INTO AffiliateTrainer VALUES(10,10,1);
CREATE TABLE IF NOT EXISTS "ClassLeaderboard" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "classId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    "scoreType" TEXT NOT NULL,
    "score" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "ClassLeaderboard_classId_fkey" FOREIGN KEY ("classId") REFERENCES "ClassSchedule" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "ClassLeaderboard_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO ClassLeaderboard VALUES(1,1,1,'rx','12','2025-01-26 08:12:45');
INSERT INTO ClassLeaderboard VALUES(2,174,5,'sc','12',1738184863502);
INSERT INTO ClassLeaderboard VALUES(3,173,5,'rx','22',1738185409451);
INSERT INTO ClassLeaderboard VALUES(4,284,5,'rx','12',1738833087653);
INSERT INTO ClassLeaderboard VALUES(5,179,5,'rx','12',1739182609419);
INSERT INTO ClassLeaderboard VALUES(6,1345,5,'rx','2',1739182734395);
INSERT INTO ClassLeaderboard VALUES(7,2670,5,'rx','12',1739975162802);
INSERT INTO ClassLeaderboard VALUES(8,2194,5,'rx','12',1740141352593);
INSERT INTO ClassLeaderboard VALUES(9,2671,5,'rx','12',1740142818781);
INSERT INTO ClassLeaderboard VALUES(10,2725,5,'rx','12',1740347198471);
INSERT INTO ClassLeaderboard VALUES(11,1613,5,'rx','22',1741466250670);
INSERT INTO ClassLeaderboard VALUES(12,2726,5,'rx','qw',1741466387513);
INSERT INTO ClassLeaderboard VALUES(13,1666,5,'rx','122',1741466669325);
INSERT INTO ClassLeaderboard VALUES(14,1719,5,'rx','1222',1741467059871);
CREATE TABLE IF NOT EXISTS "todayWOD" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "wodName" TEXT,
    "type" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "date" DATETIME NOT NULL,
    "affiliateId" INTEGER NOT NULL,
    CONSTRAINT "todayWOD_affiliateId_fkey" FOREIGN KEY ("affiliateId") REFERENCES "Affiliate" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO todayWOD VALUES(4,'AMANDA','For time','jump',1737842400000,1);
INSERT INTO todayWOD VALUES(5,'AMANDA','For time','jump',1738015200000,1);
INSERT INTO todayWOD VALUES(6,'AMANDA2','For Time',replace('200-foot dumbbell overhead lunge\n50 dumbbell box step-ups\n50 strict handstand push-ups\n200-foot handstand walk\n\n♀ 35-lb dumbbell and a 20-inch box\n♂ 50-lb dumbbell and a 24-inch box','\n',char(10)),1738022400000,10);
INSERT INTO todayWOD VALUES(7,'AMANDA2','For Time',replace('200-foot dumbbell overhead lunge\n50 dumbbell box step-ups\n50 strict handstand push-ups\n200-foot handstand walk\n\n♀ 35-lb dumbbell and a 20-inch box\n♂ 50-lb dumbbell and a 24-inch box','\n',char(10)),1738108800000,10);
INSERT INTO todayWOD VALUES(8,'HELEN','For Time','aasd',1738627200000,10);
INSERT INTO todayWOD VALUES(9,'','For Time',replace('15-12-9-6-3 reps of:\nDeadlifts (70/100 kg)\n5-4-3-2-1 reps of:\nRope climbs (4.6/4.6 m)','\n',char(10)),1738540800000,10);
INSERT INTO todayWOD VALUES(10,'','For Time',replace('5 rounds for time:\n750-m row\n30 sit-ups\n15 handstand push-ups','\n',char(10)),1738800000000,10);
INSERT INTO todayWOD VALUES(11,'','EMOM',replace('Every 2:00 for 10 rounds for load:\n10 box jumps (51/61 cm)\n3 hang squat cleans\n– Step down from the box.\nScore: Load','\n',char(10)),1739404800000,10);
INSERT INTO todayWOD VALUES(12,'','For Time',replace('\n2,000-m row','\n',char(10)),1739750400000,10);
INSERT INTO todayWOD VALUES(13,'GRACE','For Time','30 Clean and Jerks (61/43 kg) for time',1740096000000,1);
INSERT INTO todayWOD VALUES(14,'KELLIKAS','EMOM',replace('For load:\nEMOM 12:\n3 power cleans\n2 hang power cleans\n1 push jerk\n– Build in load.\n\nPost-workout\nOn an 8:00 clock:\nRow, bike, or ski','\n',char(10)),1741219200000,10);
CREATE TABLE IF NOT EXISTS "Affiliate" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "trainingType" TEXT NOT NULL,
    "email" TEXT,
    "phone" TEXT,
    "iban" TEXT,
    "bankName" TEXT,
    "ownerId" INTEGER NOT NULL, "logo" TEXT, "paymentHolidayFee" REAL, "subdomain" TEXT,
    CONSTRAINT "Affiliate_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO Affiliate VALUES(1,'cft2','asd','asd','asd@asd.ee','324234',NULL,NULL,2,NULL,NULL,NULL);
INSERT INTO Affiliate VALUES(10,'Crossfit Tartu','Aardla, Tartu','Crossfit','sander.prii@vikk.ee','+372 51234562','EE22001124462066',NULL,6,'data:image/png;base64,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',11.0,'crossfittartu');
CREATE TABLE IF NOT EXISTS "Credit" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userId" INTEGER NOT NULL,
    "credit" REAL NOT NULL DEFAULT 0.0,
    "affiliateId" INTEGER NOT NULL,
    CONSTRAINT "Credit_affiliateId_fkey" FOREIGN KEY ("affiliateId") REFERENCES "Affiliate" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Credit_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO Credit VALUES(1,5,1289.0,10);
INSERT INTO Credit VALUES(2,1,1023.0,10);
INSERT INTO Credit VALUES(3,10,100.0,10);
INSERT INTO Credit VALUES(4,8,111.0,10);
INSERT INTO Credit VALUES(5,9,1172.0,10);
INSERT INTO Credit VALUES(6,5,901.0,1);
CREATE TABLE IF NOT EXISTS "Members" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "affiliateId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    "visitCount" INTEGER DEFAULT 0,
    "addScoreCount" INTEGER DEFAULT 0,
    "atRisk" BOOLEAN NOT NULL DEFAULT false,
    "ristData" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    CONSTRAINT "Members_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Members_affiliateId_fkey" FOREIGN KEY ("affiliateId") REFERENCES "Affiliate" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO Members VALUES(1,10,1,0,0,0,NULL,1);
INSERT INTO Members VALUES(4,10,10,0,0,0,NULL,1);
INSERT INTO Members VALUES(5,10,5,0,0,0,NULL,1);
INSERT INTO Members VALUES(6,10,2,0,0,0,NULL,1);
INSERT INTO Members VALUES(8,10,7,0,0,0,NULL,1);
INSERT INTO Members VALUES(9,1,5,0,0,0,NULL,1);
INSERT INTO Members VALUES(10,10,9,0,0,0,NULL,1);
CREATE TABLE IF NOT EXISTS "UserNote" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userId" INTEGER NOT NULL,
    "note" TEXT NOT NULL,
    "flag" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "UserNote_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO UserNote VALUES(5,5,'niijanaa','yellow',1739437785188);
INSERT INTO UserNote VALUES(6,5,'asd','green',1739444590191);
CREATE TABLE IF NOT EXISTS "UserMessageGroup" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userId" INTEGER NOT NULL,
    "groupId" INTEGER NOT NULL,
    CONSTRAINT "UserMessageGroup_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "UserMessageGroup_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "MessageGroup" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO UserMessageGroup VALUES(1,1,4);
INSERT INTO UserMessageGroup VALUES(2,10,4);
INSERT INTO UserMessageGroup VALUES(3,10,3);
CREATE TABLE IF NOT EXISTS "MessageGroup" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "groupName" TEXT NOT NULL,
    "affiliateId" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "MessageGroup_affiliateId_fkey" FOREIGN KEY ("affiliateId") REFERENCES "Affiliate" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO MessageGroup VALUES(1,'nonii',10,'2025-02-11 16:46:25');
INSERT INTO MessageGroup VALUES(2,'New Group',10,1739292766871);
INSERT INTO MessageGroup VALUES(3,'tt',10,1739292927659);
INSERT INTO MessageGroup VALUES(4,'no',10,1739293090493);
CREATE TABLE IF NOT EXISTS "Message" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "affiliateId" INTEGER NOT NULL,
    "recipientId" INTEGER,
    "subject" TEXT NOT NULL,
    "recipientType" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Message_affiliateId_fkey" FOREIGN KEY ("affiliateId") REFERENCES "Affiliate" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO Message VALUES(1,10,4,'asd','group','asd',1739298738571);
INSERT INTO Message VALUES(2,10,4,'qwe','group','qwe',1739298768668);
INSERT INTO Message VALUES(3,10,10,'dfg','user','dfg',1739298894220);
INSERT INTO Message VALUES(4,10,10,'asd','user','asddddddddddddd',1739304120572);
INSERT INTO Message VALUES(11,10,3,'asdasdasd','group','asdasdasd',1739304963376);
INSERT INTO Message VALUES(12,10,0,'asdasd','allMembers','asdsad',1739305873167);
INSERT INTO Message VALUES(13,10,10,'asdasdasd','user',replace('asdasdasdasd\nasdasda\nasdasd','\n',char(10)),1739305904947);
INSERT INTO Message VALUES(14,10,0,'sfgsdf','allMembers','gsdfgsdfg',1739305969562);
INSERT INTO Message VALUES(15,10,0,'asda','allMembers',replace('df222\n3\n34\n5\n6\n7\n8','\n',char(10)),1739306330285);
INSERT INTO Message VALUES(16,10,0,'asd','allMembers',replace('asdasdasdas\ndas\nd\nasd\nas\nd','\n',char(10)),1739307057904);
INSERT INTO Message VALUES(17,10,0,'444','allMembers',replace('4\n4\n4\n4\n4\n4','\n',char(10)),1739307477762);
INSERT INTO Message VALUES(18,10,0,'asdasd','allMembers',replace('45\n34\n534\n5\n34\n5','\n',char(10)),1739307679240);
INSERT INTO Message VALUES(19,10,0,'asdfadsfadf','allMembers',replace('546\nt\nhgf\nh\nfg\nh\nfgh','\n',char(10)),1739307723151);
INSERT INTO Message VALUES(20,10,0,'dsfsdf','allMembers',replace('sdfsd\nf\nsdf\nsd\nf\nsdf\nsdf','\n',char(10)),1739308199490);
INSERT INTO Message VALUES(21,10,0,'asd','allMembers',replace('asd\nas\nda\nsd\nasd\nasd','\n',char(10)),1739308238133);
INSERT INTO Message VALUES(22,10,0,'tere','allMembers',replace('adfdasd\nasd\na\nsda\nsd\nas\nd\nas','\n',char(10)),1739778958046);
INSERT INTO Message VALUES(23,10,0,'tere','allMembers',replace('What is Lorem Ipsum?\nLorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry''s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.','\n',char(10)),1740553808090);
INSERT INTO Message VALUES(24,10,0,'Jõudu','allMembers',replace('What is Lorem Ipsum?\nLorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry''s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.','\n',char(10)),1740554221803);
INSERT INTO Message VALUES(25,10,0,'tere','allMembers',replace('What is Lorem Ipsum?\nLorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry''s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.','\n',char(10)),1740554439170);
INSERT INTO Message VALUES(26,10,0,'asd','allMembers','asd',1740571919973);
INSERT INTO Message VALUES(27,10,0,'dfgh','allMembers','dfgh',1740575635313);
INSERT INTO Message VALUES(28,10,0,'jfgh','allMembers','jfghjf',1740575815097);
INSERT INTO Message VALUES(29,10,10,'Monthly payment for Crossfit Tartu','user',replace('\n    Dear Kati Testija,\n    \n    Your monthly payment of €90 for Crossfit Tartu is due.\n    \n    Please use the following link to complete your payment:\n    https://sandbox-pay.montonio.com/01bb4013-27ba-45e0-87e8-c61ef0ffc468\n    \n    The payment link is valid for 7 days.\n    \n    Thank you!\n    IronTrack Team\n  ','\n',char(10)),1740655382383);
INSERT INTO Message VALUES(30,10,10,'Monthly payment for Crossfit Tartu','user',replace('\n    Dear Kati Testija,\n    \n    Your monthly payment of €9 for Crossfit Tartu is due.\n    \n    Please use the following link to complete your payment:\n    https://sandbox-pay.montonio.com/cc33a1e2-4541-45c7-90e8-bb4e2c3b9ced\n    \n    The payment link is valid for 7 days.\n    \n    Thank you!\n    IronTrack Team\n  ','\n',char(10)),1740655383538);
INSERT INTO Message VALUES(31,10,10,'Monthly payment for Crossfit Tartu','user',replace('\n    Dear Kati Testija,\n    \n    Your monthly payment of €90 for Crossfit Tartu is due.\n    \n    Please use the following link to complete your payment:\n    https://sandbox-pay.montonio.com/b2368919-8dc2-483e-853f-69115b391930\n    \n    The payment link is valid for 7 days.\n    \n    Thank you!\n    IronTrack Team\n  ','\n',char(10)),1740656821954);
INSERT INTO Message VALUES(32,10,10,'Monthly payment for Crossfit Tartu','user',replace('\n    Dear Kati Testija,\n    \n    Your monthly payment of €9 for Crossfit Tartu is due.\n    \n    Please use the following link to complete your payment:\n    https://sandbox-pay.montonio.com/e30de00f-6930-45c1-9f26-5d5d752bc940\n    \n    The payment link is valid for 7 days.\n    \n    Thank you!\n    IronTrack Team\n  ','\n',char(10)),1740656822493);
INSERT INTO Message VALUES(33,10,10,'Monthly payment for Crossfit Tartu','user',replace('\n    Dear Kati Testija,\n    \n    Your monthly payment of €90 for Crossfit Tartu is due.\n    \n    Please use the following link to complete your payment:\n    https://sandbox-pay.montonio.com/38545535-065f-4680-b240-f9d046639621\n    \n    The payment link is valid for 7 days.\n    \n    Thank you!\n    IronTrack Team\n  ','\n',char(10)),1740656942152);
INSERT INTO Message VALUES(34,10,10,'Monthly payment for Crossfit Tartu','user',replace('\n    Dear Kati Testija,\n    \n    Your monthly payment of €9 for Crossfit Tartu is due.\n    \n    Please use the following link to complete your payment:\n    https://sandbox-pay.montonio.com/0f9334f6-524c-4ff2-986d-62cdd3766e8e\n    \n    The payment link is valid for 7 days.\n    \n    Thank you!\n    IronTrack Team\n  ','\n',char(10)),1740656943248);
INSERT INTO Message VALUES(35,10,10,'Monthly payment for Crossfit Tartu','user',replace('\n    Dear Kati Testija,\n    \n    Your monthly payment of €90 for Crossfit Tartu is due.\n    \n    Please use the following link to complete your payment:\n    https://sandbox-pay.montonio.com/b469e91f-780f-487f-99f5-6ab9fe92bf56\n    \n    The payment link is valid for 7 days.\n    \n    Thank you!\n    IronTrack Team\n  ','\n',char(10)),1740658022734);
INSERT INTO Message VALUES(36,10,10,'Monthly payment for Crossfit Tartu','user',replace('\n    Dear Kati Testija,\n    \n    Your monthly payment of €9 for Crossfit Tartu is due.\n    \n    Please use the following link to complete your payment:\n    https://sandbox-pay.montonio.com/ad917e5a-81e0-4d4f-bc4e-7518d5ce23de\n    \n    The payment link is valid for 7 days.\n    \n    Thank you!\n    IronTrack Team\n  ','\n',char(10)),1740658023401);
INSERT INTO Message VALUES(37,10,10,'Monthly payment for Crossfit Tartu','user',replace('\n    Dear Kati Testija,\n    \n    Your monthly payment of €90 for Crossfit Tartu is due.\n    \n    Please use the following link to complete your payment:\n    https://sandbox-pay.montonio.com/c424ef7a-591d-40e2-a9c8-0ed514e91123\n    \n    The payment link is valid for 7 days.\n    \n    Thank you!\n    IronTrack Team\n  ','\n',char(10)),1740658382103);
INSERT INTO Message VALUES(38,10,10,'Monthly payment for Crossfit Tartu','user',replace('\n    Dear Kati Testija,\n    \n    Your monthly payment of €9 for Crossfit Tartu is due.\n    \n    Please use the following link to complete your payment:\n    https://sandbox-pay.montonio.com/8332997d-f7fe-45d0-9b85-d6b934597bda\n    \n    The payment link is valid for 7 days.\n    \n    Thank you!\n    IronTrack Team\n  ','\n',char(10)),1740658383743);
INSERT INTO Message VALUES(39,10,10,'Monthly payment for Crossfit Tartu','user',replace('\n    Dear Kati Testija,\n    \n    Your monthly payment of €90 for Crossfit Tartu is due.\n    \n    Please use the following link to complete your payment:\n    https://sandbox-pay.montonio.com/4e65961d-5bf8-4f40-aca1-7387309d662a\n    \n    The payment link is valid for 7 days.\n    \n    Thank you!\n    IronTrack Team\n  ','\n',char(10)),1740658862469);
INSERT INTO Message VALUES(40,10,10,'Monthly payment for Crossfit Tartu','user',replace('\n    Dear Kati Testija,\n    \n    Your monthly payment of €9 for Crossfit Tartu is due.\n    \n    Please use the following link to complete your payment:\n    https://sandbox-pay.montonio.com/ffdc04db-76c4-4e68-8663-8d69dc5287ec\n    \n    The payment link is valid for 7 days.\n    \n    Thank you!\n    IronTrack Team\n  ','\n',char(10)),1740658863288);
INSERT INTO Message VALUES(41,10,10,'Monthly payment for Crossfit Tartu','user',replace('\n    Dear Kati Testija,\n    \n    Your monthly payment of €90 for Crossfit Tartu is due.\n    \n    Please use the following link to complete your payment:\n    https://sandbox-pay.montonio.com/39023879-8792-4bff-9c27-b241e8b90598\n    \n    The payment link is valid for 7 days.\n    \n    Thank you!\n    IronTrack Team\n  ','\n',char(10)),1740659401477);
INSERT INTO Message VALUES(42,10,10,'Monthly payment for Crossfit Tartu','user',replace('\n    Dear Kati Testija,\n    \n    Your monthly payment of €9 for Crossfit Tartu is due.\n    \n    Please use the following link to complete your payment:\n    https://sandbox-pay.montonio.com/651ee176-98e9-47b6-a567-787033ab1297\n    \n    The payment link is valid for 7 days.\n    \n    Thank you!\n    IronTrack Team\n  ','\n',char(10)),1740659402126);
INSERT INTO Message VALUES(43,10,10,'Monthly payment for Crossfit Tartu','user',replace('\n    Dear Kati Testija,\n    \n    Your monthly payment of €90 for Crossfit Tartu is due.\n    \n    Please use the following link to complete your payment:\n    https://sandbox-pay.montonio.com/89a78a84-6a05-43bf-8389-a5ad1d47bbd8\n    \n    The payment link is valid for 7 days.\n    \n    Thank you!\n    IronTrack Team\n  ','\n',char(10)),1740896401591);
INSERT INTO Message VALUES(44,10,10,'Monthly payment for Crossfit Tartu','user',replace('\n    Dear Kati Testija,\n    \n    Your monthly payment of €90 for Crossfit Tartu is due.\n    \n    Please use the following link to complete your payment:\n    https://sandbox-pay.montonio.com/4536a0c2-051b-45f8-b4b1-2b40a7f60d9b\n    \n    The payment link is valid for 7 days.\n    \n    Thank you!\n    IronTrack Team\n  ','\n',char(10)),1740898202233);
INSERT INTO Message VALUES(45,10,10,'Monthly payment for Crossfit Tartu','user',replace('\n    Dear Kati Testija,\n    \n    Your monthly payment of €9 for Crossfit Tartu is due.\n    \n    Please use the following link to complete your payment:\n    https://sandbox-pay.montonio.com/45254360-c31d-472e-93d7-1ba064154718\n    \n    The payment link is valid for 7 days.\n    \n    Thank you!\n    IronTrack Team\n  ','\n',char(10)),1740898203210);
INSERT INTO Message VALUES(46,10,10,'Monthly payment for Crossfit Tartu','user',replace('\n    Dear Kati Testija,\n    \n    Your monthly payment of €90 for Crossfit Tartu is due.\n    \n    Please use the following link to complete your payment:\n    https://sandbox-pay.montonio.com/17349a0e-42c5-41c8-a817-b3b6c9474ab2\n    \n    The payment link is valid for 7 days.\n    \n    Thank you!\n    IronTrack Team\n  ','\n',char(10)),1740898381844);
INSERT INTO Message VALUES(47,10,10,'Monthly payment for Crossfit Tartu','user',replace('\n    Dear Kati Testija,\n    \n    Your monthly payment of €9 for Crossfit Tartu is due.\n    \n    Please use the following link to complete your payment:\n    https://sandbox-pay.montonio.com/8ce42586-005f-498a-b362-01691b99892e\n    \n    The payment link is valid for 7 days.\n    \n    Thank you!\n    IronTrack Team\n  ','\n',char(10)),1740898382765);
INSERT INTO Message VALUES(48,10,10,'Monthly payment for Crossfit Tartu','user',replace('\n    Dear Kati Testija,\n    \n    Your monthly payment of €90 for Crossfit Tartu is due.\n    \n    Please use the following link to complete your payment:\n    https://sandbox-pay.montonio.com/7d041643-683e-46d7-9d96-2ddde8b33a40\n    \n    The payment link is valid for 7 days.\n    \n    Thank you!\n    IronTrack Team\n  ','\n',char(10)),1740902281730);
INSERT INTO Message VALUES(49,10,10,'Monthly payment for Crossfit Tartu','user',replace('\n    Dear Kati Testija,\n    \n    Your monthly payment of €9 for Crossfit Tartu is due.\n    \n    Please use the following link to complete your payment:\n    https://sandbox-pay.montonio.com/7efcadf5-feb0-4ee2-9ab3-c4c84ecd07cd\n    \n    The payment link is valid for 7 days.\n    \n    Thank you!\n    IronTrack Team\n  ','\n',char(10)),1740902282303);
INSERT INTO Message VALUES(50,10,10,'Payment Holiday Fee for Crossfit Tartu - March','user',replace('\n    Dear Kati Testija,\n    \n    This is a payment holiday month for your subscription with Crossfit Tartu.\n    \n    A reduced fee of €11 is due for March.\n    \n    Please use the following link to complete your payment:\n    https://sandbox-pay.montonio.com/0e8a5f35-57be-4205-af20-ba92899b0d1f\n    \n    The payment link is valid for 7 days.\n    \n    Thank you!\n    IronTrack Team\n  ','\n',char(10)),1740902461445);
INSERT INTO Message VALUES(51,10,10,'Monthly payment for Crossfit Tartu','user',replace('\n    Dear Kati Testija,\n    \n    Your monthly payment of €9 for Crossfit Tartu is due.\n    \n    Please use the following link to complete your payment:\n    https://sandbox-pay.montonio.com/9a8e7b9f-2672-430b-bfe1-2f275e182269\n    \n    The payment link is valid for 7 days.\n    \n    Thank you!\n    IronTrack Team\n  ','\n',char(10)),1740902462648);
INSERT INTO Message VALUES(52,10,10,'Payment Holiday Fee for Crossfit Tartu - March','user',replace('\n    Dear Kati Testija,\n    \n    This is a payment holiday month for your subscription with Crossfit Tartu.\n    \n    A reduced fee of €11 is due for March.\n    \n    Please use the following link to complete your payment:\n    https://sandbox-pay.montonio.com/5b4730bb-9cc7-41fe-8e3d-c48d656b82a5\n    \n    The payment link is valid for 7 days.\n    \n    Thank you!\n    IronTrack Team\n  ','\n',char(10)),1740902701578);
INSERT INTO Message VALUES(53,10,10,'Early Payment Notification: Monthly payment for Crossfit Tartu','user',replace('\n    Dear Kati Testija,\n    \n    This is an early payment notification. Your payment is due on 07/03/2025.\n\nYour monthly payment of €90 for Crossfit Tartu is due.\n    \n    Please use the following link to complete your payment:\n    https://sandbox-pay.montonio.com/4355923f-c137-439e-8c00-4ce55b353ada\n    \n    The payment link is valid for 7 days.\n    \n    Thank you!\n    IronTrack Team\n  ','\n',char(10)),1740905406500);
INSERT INTO Message VALUES(54,10,10,'Early Payment Notification: Monthly payment for Crossfit Tartu','user',replace('\n    Dear Kati Testija,\n    \n    This is an early payment notification. Your payment is due on 07/03/2025.\n\nYour monthly payment of €90 for Crossfit Tartu is due.\n    \n    Please use the following link to complete your payment:\n    https://sandbox-pay.montonio.com/795e8299-6aa8-48fa-8168-0e2e99ad2cae\n    \n    The payment link is valid for 7 days.\n    \n    Thank you!\n    IronTrack Team\n  ','\n',char(10)),1740905701512);
INSERT INTO Message VALUES(55,10,10,'Early Payment Notification: Payment Holiday Fee for Crossfit Tartu - March','user',replace('\n    Dear Kati Testija,\n    \n    This is an early payment notification. Your payment is due on 07/03/2025.\n\nThis is a payment holiday month for your subscription with Crossfit Tartu.\n    \n    A reduced fee of €11 is due for March.\n    \n    Please use the following link to complete your payment:\n    https://sandbox-pay.montonio.com/7d34bb07-e7e4-4f91-b7d3-595dfd7dbfbf\n    \n    The payment link is valid for 7 days.\n    \n    Thank you!\n    IronTrack Team\n  ','\n',char(10)),1740905822284);
INSERT INTO Message VALUES(56,10,10,'Early Payment Notification: Payment Holiday Fee for Crossfit Tartu - March','user',replace('\n    Dear Kati Testija,\n    \n    This is an early payment notification. Your payment is due on 07/03/2025.\n\nThis is a payment holiday month for your subscription with Crossfit Tartu.\n    \n    A reduced fee of €11 is due for March.\n    \n    Please use the following link to complete your payment:\n    https://sandbox-pay.montonio.com/b2358fee-671b-48e7-b620-86959f498eb2\n    \n    The payment link is valid for 7 days.\n    \n    Thank you!\n    IronTrack Team\n  ','\n',char(10)),1740905942196);
INSERT INTO Message VALUES(57,10,10,'You''ve been registered for OPEN GYM','user',replace('\nDear Kati Testija,\n\nGood news! A spot has opened up in the class "OPEN GYM" scheduled for 03/03/2025, 11:00:00.\n\nYou have been automatically registered for this class from the waitlist.\n\nLocation: Must saal\nTrainer: Tarvi Torn\n\nWe look forward to seeing you there!\n\nIronTrack Team\n                    ','\n',char(10)),1740920542285);
INSERT INTO Message VALUES(58,10,10,'You''ve been registered for OPEN GYM','user',replace('\nDear Kati Testija,\n\nGood news! A spot has opened up in the class "OPEN GYM" scheduled for 03/03/2025, 11:00:00.\n\nYou have been automatically registered for this class from the waitlist.\n\nLocation: Must saal\nTrainer: Tarvi Torn\n\nWe look forward to seeing you there!\n\nIronTrack Team\n                ','\n',char(10)),1740920854010);
INSERT INTO Message VALUES(59,10,10,'You''ve been registered for OPEN GYM','user',replace('\nDear Kati Testija,\n\nGood news! A spot has opened up in the class "OPEN GYM" scheduled for 03/03/2025, 11:00:00.\n\nYou have been automatically registered for this class from the waitlist.\n\nClass: N/A\nTime: 03/03/2025, 11:00:00\nTrainer: Tarvi Torn\n\nWe look forward to seeing you there!\n\nIronTrack Team\n                ','\n',char(10)),1740920992251);
INSERT INTO Message VALUES(60,10,10,'Early Payment Notification: Payment Holiday Fee for Crossfit Tartu - March','user',replace('\n    Dear Kati Testija,\n    \n    This is an early payment notification. Your payment is due on 09/03/2025.\n\nThis is a payment holiday month for your subscription with Crossfit Tartu.\n    \n    A reduced fee of €11 is due for March.\n    \n    Please use the following link to complete your payment:\n    https://sandbox-pay.montonio.com/32a1247c-12e3-425f-a7c8-7e090c10cc7f\n    \n    The payment link is valid for 7 days.\n    \n    Thank you!\n    IronTrack Team\n  ','\n',char(10)),1741112221979);
INSERT INTO Message VALUES(61,10,7,'You''ve been registered for Open Gym','user',replace('\nDear asd,\n\nGood news! A spot has opened up in the class "Open Gym" scheduled for 06/03/2025, 11:00:00.\n\nYou have been automatically registered for this class from the waitlist.\n\n\nTime: 06/03/2025, 11:00:00\nTrainer: Karl Sasi\n\nWe look forward to seeing you there!\n\nIronTrack Team\n                ','\n',char(10)),1741115728506);
INSERT INTO Message VALUES(62,10,9,'You''ve been registered for Open Gym','user',replace('\nDear asd,\n\nGood news! A spot has opened up in the class "Open Gym" scheduled for 06/03/2025, 11:00:00.\n\nYou have been automatically registered for this class from the waitlist.\n\n\nTime: 06/03/2025, 11:00:00\nTrainer: Karl Sasi\n\nWe look forward to seeing you there!\n\nIronTrack Team\n                ','\n',char(10)),1741116206822);
INSERT INTO Message VALUES(63,10,9,'You''ve been registered for Open Gym','user',replace('\nDear asd,\n\nGood news! A spot has opened up in the class "Open Gym" scheduled for 06/03/2025, 11:00:00.\n\nYou have been automatically registered for this class from the waitlist.\n\n\nTime: 06/03/2025, 11:00:00\nTrainer: Karl Sasi\n\nWe look forward to seeing you there!\n\nIronTrack Team\n                ','\n',char(10)),1741116405578);
CREATE TABLE IF NOT EXISTS "ContractTemplate" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "affiliateId" INTEGER NOT NULL,
    "content" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "ContractTemplate_affiliateId_fkey" FOREIGN KEY ("affiliateId") REFERENCES "Affiliate" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO ContractTemplate VALUES('38e6265a-5ca4-4b37-8ca1-cb295fb4b483',10,replace('Leping nr [X]\nSõlmitud: [kuupäev]\n\nLepingupooled:\n\nCrossFit Tartu\n\nOmanik: Ain Lubi\nAsukoht: Tartu, Aardla\nedaspidi „Teenusepakkuja” või „Affiliate“\n[Kliendi nimi ja isikukood]\n\n[Kontaktandmed: aadress, telefon, e-post]\nedaspidi „Klient”\n1. Lepingu ese\n1.1 Käesoleva lepingu esemeks on CrossFit Tartu poolt pakutavate treeningvõimaluste, sh rühmatreeningute, iseseisva treeningu ja muude seotud teenuste kasutamise õigus.\n1.2 Leping on tähtajatu ning Klient võib tasu eest kasutada Teenusepakkuja treeningteenuseid käesolevas lepingus sätestatud tingimustel.\n\n2. Liikmemaks ja maksetingimused\n2.1 Klient kohustub tasuma igakuist liikmemaksu summas [X eurot].\n2.2 Liikmemaks kuulub tasumisele hiljemalt iga kuu 15. kuupäevaks.\n2.3 Maksetingimused (sh arveldusarve number, selgitus jms) määratakse Teenusepakkuja poolt. Klient vastutab õigeaegse ning õige viitenumbriga tasumise eest.\n2.4 Viivitusintressi või leppetrahvi võidakse rakendada vastavalt Teenusepakkuja kehtestatud üldtingimustele, kui Klient ei ole kokkulepitud tähtpäevaks liikmemaksu tasunud. Teenusepakkuja võib samuti peatada Kliendi treeninguõiguse, kuni võlgnevus on tasutud.\n\n3. Teenuste kasutamine\n3.1 Klient on kohustatud tutvuma CrossFit Tartu sisekorraeeskirjadega (sh turvalisus, hügieen, treeningute registreerimine, tühistamise kord jms) ja neid täitma.\n3.2 Teenusepakkujal on õigus ajutiselt piirata treeningute või ruumide kasutamist seoses remondi, hooldustööde või muude etteplaneeritud tegevustega, teavitades sellest mõistliku aja jooksul ette.\n3.3 Teenusepakkuja võib teha muudatusi treeningute ajakavas, hinnakirjas või sisukorras, teavitades sellest Kliendi e-posti või veebilehe vahendusel. Oluliste muudatuste puhul on Kliendil õigus leping üles öelda, teatades sellest 14 päeva ette.\n\n4. Lepingu kestus ja lõpetamine\n4.1 Leping jõustub selle allkirjastamisest (või digiallkirjast) ning on sõlmitud tähtajatult.\n4.2 Klient võib lepingu igal ajal üles öelda, esitades Teenusepakkujale kirjaliku (või digitaalse) avalduse. Lepingu lõppemisest tulenevalt arvestatakse liikmemaks proportsionaalselt selle kuu kasutusajaga või vastavalt Teenusepakkuja üldtingimustele.\n4.3 Teenusepakkuja võib lepingu erakorraliselt lõpetada, kui Klient on oluliselt lepingut rikkunud (näiteks korduv makseviivitus või sisekorraeeskirjade rikkumine).\n\n5. Vastutus ja pretensioonid\n5.1 Teenusepakkuja vastutab Kliendi ees üksnes siis, kui kahju või kahjustus on põhjustatud Teenusepakkuja raskest hooletusest või tahtlikust tegevusest.\n5.2 Klient vastutab oma tervisliku seisundi eest ning on kohustatud veenduma, et tal pole vastunäidustusi treeningutes osalemiseks.\n5.3 Kui Kliendil on kaebusi või pretensioone, lahendatakse need esmalt heas usus läbirääkimiste teel. Vaidluste jätkumisel on Kliendil õigus pöörduda Tarbijakaitse ja Tehnilise Järelevalve Ameti või kohtusse vastavalt Eesti Vabariigi seadustele.\n\n6. Isikuandmete kaitse ja GDPR\n6.1 Teenusepakkuja töötleb Kliendi isikuandmeid (nt nimi, kontaktandmed, makseinfo) üksnes teenuste osutamiseks, lepingu täitmiseks, raamatupidamis- või juriidiliste kohustuste täitmiseks vastavalt Euroopa Liidu isikuandmete kaitse üldmäärusele (GDPR) ja Eesti seadustele.\n6.2 Klient võib igal ajal küsida teavet enda isikuandmete töötlemise kohta ning taotleda parandamist, kustutamist või töötlemise piiramist, kui see ei ole vastuolus seadusest tulenevate kohustustega.\n\n7. Muud tingimused\n7.1 Poolte vahelised teated loetakse kehtivaks, kui need on edastatud e-posti teel, kirjalikult või muus tõendatavas vormis.\n7.2 Kõik lepingus puuduvad küsimused ja suhted lahendatakse vastavalt Eesti Vabariigi kehtivatele õigusaktidele.\n7.3 Kokkuleppe muutmine või täiendamine toimub kirjalikult või digiallkirjastatud lisakokkuleppega.\n\n8. Allkirjastamine ja jõustumine\n8.1 Klient kinnitab, et on käesoleva lepingu ja teenusepakkuja Terms and Conditions (üldtingimuste) sisust aru saanud ning nõustub nendega.\n8.2 Leping loetakse sõlmituks ning õiguslikult siduvaks hetkest, mil Klient on lepingu allkirjastanud (sh digiallkirjastanud) või klõpsanud „Accept” (nõustun) nuppu.\n\nPOOLTE ALLEKIRJAD\n\nCrossFit Tartu\n(omanik Ain Lubi)\nAllkiri: …………………….. Kuupäev: ………………\n\nKlient\n[nimi ja isikukood]\nAllkiri: …………………….. Kuupäev: ………………','\n',char(10)),1739469144654);
INSERT INTO ContractTemplate VALUES('d4f11949-3c94-4c02-97c5-e1fcb2f18b63',1,'see on affiliateId: 1 default contract. cft2',1739973711491);
CREATE TABLE IF NOT EXISTS "ContractTerms" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "type" TEXT NOT NULL,
    "terms" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO ContractTerms VALUES(1,'contract',replace('Terms and Conditions\nLast updated: [Date]\n\n1. Introduction\n1.1 These Terms and Conditions (“T&C”) govern your use of and/or subscription to the membership services (“Services”) provided by [Provider] (“we,” “us,” “our”).\n1.2 By clicking on the “Accept” button (or a similarly labeled checkbox) and/or by signing this contract electronically, you acknowledge that you have read, understood, and agree to be legally bound by these T&C.\n\n2. Parties to the Agreement\n2.1 The parties to this Agreement are:\n\n[Provider Name, if needed at runtime], hereinafter referred to as the “Provider,” and\nYou, hereinafter referred to as the “Member” or “you.”\n2.2 These T&C also apply to any amendments, supplemental policies, or additional documents that are referenced or linked within these T&C.\n\n3. Scope of Services\n3.1 The Provider offers gym or fitness-related membership services, including but not limited to access to facilities, group classes, personal training sessions, and other related offerings (“Services”).\n3.2 All Services are subject to availability and may be modified, updated, or discontinued at any time at the Provider’s discretion, provided reasonable notice is given for significant changes.\n\n4. Membership and Payment\n4.1 Membership: Your membership entitles you to the benefits specified in the membership plan you select.\n4.2 Fees: You agree to pay the membership fees according to the plan you have chosen. All fees are due in advance and must be paid on the due date indicated in the payment schedule.\n4.3 Payment Methods: Acceptable forms of payment include [list methods, e.g., credit card, direct debit, etc.]. You agree to keep your payment information accurate and updated.\n4.4 Late Payment: Late or missed payments may result in suspension or termination of membership, and you may be charged a late fee or any applicable administrative fee.\n4.5 Refunds: Unless otherwise stated by applicable consumer protection laws, membership fees are generally non-refundable. Any exceptions will be handled in compliance with applicable EU consumer protection regulations and relevant national laws.\n\n5. Data Protection (GDPR)\n5.1 Data Controller: The Provider acts as the Data Controller for personal data you provide.\n5.2 Purpose of Data Processing: Personal data (e.g., name, contact details, payment information, and fitness activity) is processed for the following purposes:\n\nMembership administration and invoicing\nProviding access to facilities and Services\nCommunicating with you regarding updates or changes to your membership\nComplying with legal obligations (e.g., accounting, safety, or public health requirements)\n5.3 Legal Basis: The legal bases for processing your personal data include your consent (when required), performance of a contract, and compliance with legal obligations.\n5.4 Data Sharing: Your personal data may be shared with third parties only to the extent necessary for payment processing, IT support, or other legitimate business needs. All third parties must adhere to data protection requirements in line with the EU General Data Protection Regulation (“GDPR”).\n5.5 Data Retention: Personal data is retained as long as necessary to fulfill the purposes outlined in these T&C, unless a different retention period is required by law.\n5.6 Your Rights: Under the GDPR, you have the right to access, correct, delete, restrict, or object to the processing of your personal data, as well as the right to data portability. You may also lodge a complaint with a supervisory authority if you believe your rights have been infringed.\n5.7 Contact for Privacy Matters: If you have questions about data processing or wish to exercise your rights, please contact [provider’s email/phone/address, or generic contact point].\n6. User Conduct\n6.1 You agree to use the facilities and Services responsibly and to respect other members and staff.\n6.2 You will abide by any facility rules, safety instructions, and applicable policies that the Provider implements.\n\n7. Warranties and Limitation of Liability\n7.1 Warranties: The Provider makes reasonable efforts to ensure Services are provided with due care and skill but does not guarantee uninterrupted or error-free operation.\n7.2 Liability: To the maximum extent permitted by applicable law, the Provider shall not be liable for any indirect, incidental, special, or consequential damages, including but not limited to loss of profits, data, or goodwill. The Provider is not liable for personal injury or property damage sustained while using facilities, except where caused by the Provider’s gross negligence or willful misconduct.\n7.3 Consumer Rights: Nothing in these T&C limits your statutory rights under EU or local consumer protection laws.\n\n8. Termination\n8.1 Termination by You: You may terminate your membership by providing notice per the cancellation policy stated in your membership plan or required by law.\n8.2 Termination by the Provider: The Provider may terminate or suspend your membership if you breach these T&C, fail to pay fees, or otherwise violate any applicable law or policies.\n8.3 Effects of Termination: Upon termination, your access to Services ends. Any outstanding fees become immediately due, unless otherwise specified by law or agreement.\n\n9. Governing Law and Dispute Resolution\n9.1 These T&C are governed by and construed in accordance with applicable local laws and EU regulations.\n9.2 Any disputes arising from or in connection with these T&C shall be subject to the jurisdiction of the competent courts in [jurisdiction] (or as otherwise mandated by consumer protection rules).\n\n10. Changes to These Terms\n10.1 The Provider reserves the right to modify these T&C from time to time. In the event of significant changes, reasonable notice will be provided (e.g., via email or a website announcement).\n10.2 Continued use of Services after such changes signifies your acceptance of the updated T&C.\n\n11. Binding Acceptance\n11.1 By checking the “I Accept the Terms and Conditions” box (or an equivalent statement) and clicking the “Accept” button, you confirm that you have read, understood, and agree to abide by these T&C.\n11.2 You acknowledge that clicking the “Accept” button creates a legally binding agreement between you and the Provider, having the same legal effect as a written and signed contract.\n\n12. Contact Information\nFor any questions or concerns about these T&C, please contact [generic provider contact details or instructions].','\n',char(10)),1739467874195);
INSERT INTO ContractTerms VALUES(2,'register',replace('Terms and Conditions for Irontrack\nLast Updated: 25.02.2025\n\n1. Introduction\nThese Terms and Conditions ("Terms") govern your use of [Your App Name] (the "App"), operated by [Your Company Name] ("we," "us," or "our"). By accessing or using the App, you agree to comply with these Terms. The App is designed for fitness clubs and users in Estonia, Latvia, and Lithuania (the "Baltic Region").\n\n2. Acceptance of Terms\nBy creating an account, purchasing packages, or using any services through the App, you:\n\nConfirm you are at least 18 years old or have legal guardian consent.\n\nAgree to be legally bound by these Terms.\n\nAcknowledge sole responsibility for risks associated with fitness activities booked via the App.\n\n3. User Responsibilities\n3.1 General Obligations\nProvide accurate and current information during registration.\n\nMaintain the confidentiality of your account credentials.\n\nNotify us immediately of unauthorized account use.\n\n3.2 Fitness Activities\nAssumption of Risk: You acknowledge that participating in workouts, classes, or events booked through the App carries inherent risks (e.g., injury, illness, or death). You voluntarily assume all risks.\n\nHealth Disclaimer: Confirm you are in good physical health and have consulted a medical professional before engaging in strenuous activities.\n\nRelease of Liability: Neither [Your Company Name] nor affiliated fitness clubs are liable for injuries, damages, or losses arising from your participation in workouts.\n\n4. Fitness Club Responsibilities\nClubs using the App to manage memberships, sell packages, or host workouts agree to:\n\nProvide accurate descriptions of workouts, including intensity levels and requirements.\n\nComply with all local laws and safety standards in the Baltic Region.\n\nMaintain appropriate insurance coverage for their activities.\n\n5. Payments & Refunds\nAll purchases (e.g., workout packages, subscriptions) are final unless otherwise stated.\n\nRefunds may be granted at the sole discretion of the fitness club or [Your Company Name].\n\nSubscriptions auto-renew unless canceled before the billing cycle.\n\n6. Intellectual Property\nThe App, its content, logos, and features are owned by [Your Company Name] and protected under EU and Baltic copyright laws.\n\nYou may not copy, modify, or distribute App content without written permission.\n\n7. Data Privacy\nWe comply with the EU General Data Protection Regulation (GDPR).\n\nPersonal data (e.g., name, email, payment details) is collected to provide services and improve the App.\n\nUsers may request data deletion or corrections via [contact email].\n\n8. Termination\nWe reserve the right to suspend or terminate your access to the App for:\n\nViolations of these Terms.\n\nFraudulent or harmful behavior.\n\nNon-payment of fees.\n\n9. Governing Law\nThese Terms are governed by the laws of [Your Company’s Registered Country, e.g., Estonia]. Disputes will be resolved in the courts of [Jurisdiction City].\n\n10. Changes to Terms\nWe may update these Terms periodically. Continued use of the App after changes constitutes acceptance.\n\n11. Contact\nFor questions about these Terms, contact:\n[Your Company Name]\n[Email Address]\n[Physical Address in the Baltic Region]\n\nBy clicking "I Accept," you confirm that you have read, understood, and agree to these Terms and assume full responsibility for your actions.','\n',char(10)),'2025-02-25 10:03:43');
CREATE TABLE IF NOT EXISTS "transactions" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userId" INTEGER NOT NULL,
    "amount" REAL NOT NULL,
    "invoiceNumber" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" TEXT,
    "type" TEXT,
    "affiliateId" INTEGER NOT NULL,
    "planId" INTEGER,
    "creditId" INTEGER,
    "isCredit" BOOLEAN DEFAULT false,
    "decrease" BOOLEAN NOT NULL DEFAULT true,
    "memberId" INTEGER,
    CONSTRAINT "transactions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "transactions_planId_fkey" FOREIGN KEY ("planId") REFERENCES "Plan" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "transactions_affiliateId_fkey" FOREIGN KEY ("affiliateId") REFERENCES "Affiliate" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "transactions_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES "Members" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "transactions_creditId_fkey" FOREIGN KEY ("creditId") REFERENCES "Credit" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO transactions VALUES(120,5,9.0,'contract-2-1740938971713','Contract payment: credit Contract Payment',1740938972407,'success','contract',10,NULL,NULL,0,1,NULL);
INSERT INTO transactions VALUES(121,5,55.0,'contract-1-1740939513601','Contract payment: cred Contract Payment',1740939514217,'success','contract',10,NULL,NULL,0,1,NULL);
INSERT INTO transactions VALUES(122,5,55.0,'contract-1-1740939587342','Contract payment: cred Contract Payment',1740939587791,'success','contract',10,NULL,NULL,0,1,NULL);
INSERT INTO transactions VALUES(123,5,55.0,'contract-1-1740939643441','Contract payment: cred Contract Payment',1740939643966,'success','contract',10,NULL,NULL,0,1,NULL);
INSERT INTO transactions VALUES(124,5,50.0,'20250302182352','Plan purchase: Unlimited, by: c@c.c, from: Crossfit Tartu, paid by credit: 50€',1740939832196,'success','credit',10,1,NULL,0,1,5);
INSERT INTO transactions VALUES(125,5,50.0,'20250302182414','Plan purchase: Unlimited, by: c@c.c, from: Crossfit Tartu, paid by credit: 25€',1740939867851,'success','mixed',10,1,NULL,0,1,5);
INSERT INTO transactions VALUES(126,5,55.0,'contract-1-1740940487667','Contract payment: cred Contract Payment',1740940488300,'success','contract',10,NULL,NULL,0,1,NULL);
INSERT INTO transactions VALUES(127,5,50.0,'20250302183523','Plan purchase: Unlimited, by: c@c.c, from: Crossfit Tartu, paid by credit: 0€',1740940540977,'success','montonio',10,1,NULL,0,1,5);
INSERT INTO transactions VALUES(128,10,11.0,'2025030412575','Payment holiday fee for contract #1',1741112220640,'pending','montonio',10,NULL,NULL,0,1,NULL);
INSERT INTO transactions VALUES(129,9,50.0,'20250304192106','Plan purchase: Unlimited, by: prii.sander@gmail.com, from: Crossfit Tartu, paid by credit: 50€',1741116066240,'success','credit',10,1,NULL,0,1,10);
INSERT INTO transactions VALUES(130,5,1000.0,'20250308202723','stebby',1741465643891,'success',NULL,10,NULL,1,1,0,NULL);
CREATE TABLE IF NOT EXISTS "ClassAttendee" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "classId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    "userPlanId" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "checkIn" BOOLEAN NOT NULL DEFAULT false,
    "affiliateId" INTEGER NOT NULL,
    CONSTRAINT "ClassAttendee_classId_fkey" FOREIGN KEY ("classId") REFERENCES "ClassSchedule" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "ClassAttendee_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "ClassAttendee_affiliateId_fkey" FOREIGN KEY ("affiliateId") REFERENCES "Affiliate" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO ClassAttendee VALUES(1,2194,5,11,1740141309859,1,10);
INSERT INTO ClassAttendee VALUES(2,2459,5,11,1740141313566,1,10);
INSERT INTO ClassAttendee VALUES(3,2671,5,21,1740142816035,1,1);
INSERT INTO ClassAttendee VALUES(5,2565,5,2,1740346556550,0,10);
INSERT INTO ClassAttendee VALUES(14,2195,5,65,1740937754998,0,10);
INSERT INTO ClassAttendee VALUES(22,1825,9,74,1741116404825,1,10);
INSERT INTO ClassAttendee VALUES(23,1613,5,72,1741119799642,0,10);
INSERT INTO ClassAttendee VALUES(24,2726,5,72,1741466384624,0,10);
CREATE TABLE IF NOT EXISTS "ContractLogs" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "contractId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    "affiliateId" INTEGER NOT NULL,
    "action" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "ContractLogs_contractId_fkey" FOREIGN KEY ("contractId") REFERENCES "Contract" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "ContractLogs_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "ContractLogs_affiliateId_fkey" FOREIGN KEY ("affiliateId") REFERENCES "Affiliate" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO ContractLogs VALUES(2,'2ea5fccc-69e4-4d14-b2ae-217c0e5d5d67',5,10,'User accepted the contract',1739455365948);
INSERT INTO ContractLogs VALUES(3,'2ea5fccc-69e4-4d14-b2ae-217c0e5d5d67',5,10,'User accepted the contract',1739463769361);
INSERT INTO ContractLogs VALUES(4,'485515e2-6ff6-473e-84e1-8c94afd92274',5,10,'User accepted the contract',1739468167345);
INSERT INTO ContractLogs VALUES(5,'62d87236-7374-479f-9a7c-19479c9f798c',5,10,'User accepted the contract',1739777877058);
INSERT INTO ContractLogs VALUES(6,1,5,10,'User accepted the contract',1740499756919);
INSERT INTO ContractLogs VALUES(7,1,5,10,'User accepted the contract',1740499904827);
INSERT INTO ContractLogs VALUES(8,1,5,10,'Contract updated',1740502220122);
INSERT INTO ContractLogs VALUES(9,1,5,10,'Contract updated',1740509208140);
INSERT INTO ContractLogs VALUES(10,1,5,10,'Contract updated',1740552256908);
INSERT INTO ContractLogs VALUES(11,1,5,10,'Contract updated',1740552282355);
INSERT INTO ContractLogs VALUES(12,2,10,10,'change end date',1740552463083);
INSERT INTO ContractLogs VALUES(13,2,5,10,'User accepted the contract',1740931889895);
INSERT INTO ContractLogs VALUES(14,2,5,10,'User accepted the contract',1740932163470);
INSERT INTO ContractLogs VALUES(15,2,5,10,'User accepted the contract',1740932279764);
INSERT INTO ContractLogs VALUES(16,2,5,10,'User accepted the contract',1740932460823);
INSERT INTO ContractLogs VALUES(17,2,5,10,'User accepted the contract',1740937319463);
INSERT INTO ContractLogs VALUES(18,2,5,10,'User accepted the contract',1740937398508);
INSERT INTO ContractLogs VALUES(19,2,5,10,'User accepted the contract',1740938154166);
INSERT INTO ContractLogs VALUES(20,2,5,10,'User accepted the contract',1740938276717);
INSERT INTO ContractLogs VALUES(21,2,5,10,'User accepted the contract',1740938990076);
INSERT INTO ContractLogs VALUES(22,1,5,10,'User accepted the contract',1740939526818);
INSERT INTO ContractLogs VALUES(23,1,5,10,'User accepted the contract',1740939600953);
INSERT INTO ContractLogs VALUES(24,1,5,10,'User accepted the contract',1740939655878);
INSERT INTO ContractLogs VALUES(25,1,5,10,'User accepted the contract',1740940506695);
INSERT INTO ContractLogs VALUES(26,1,5,10,'change end date',1741464192041);
CREATE TABLE IF NOT EXISTS "SignedContract" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "contractId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    "affiliateId" INTEGER NOT NULL,
    "acceptType" TEXT NOT NULL,
    "contractTermsId" INTEGER NOT NULL,
    "signedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "SignedContract_contractId_fkey" FOREIGN KEY ("contractId") REFERENCES "Contract" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "SignedContract_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "SignedContract_affiliateId_fkey" FOREIGN KEY ("affiliateId") REFERENCES "Affiliate" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "SignedContract_contractTermsId_fkey" FOREIGN KEY ("contractTermsId") REFERENCES "ContractTerms" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO SignedContract VALUES(1,'2ea5fccc-69e4-4d14-b2ae-217c0e5d5d67',5,10,'checkbox',1,1739455365974);
INSERT INTO SignedContract VALUES(2,'2ea5fccc-69e4-4d14-b2ae-217c0e5d5d67',5,10,'checkbox',1,1739463769385);
INSERT INTO SignedContract VALUES(3,'485515e2-6ff6-473e-84e1-8c94afd92274',5,10,'checkbox',1,1739468167367);
INSERT INTO SignedContract VALUES(4,'62d87236-7374-479f-9a7c-19479c9f798c',5,10,'checkbox',1,1739777877082);
INSERT INTO SignedContract VALUES(5,2,5,10,'checkout',1,1740931889918);
INSERT INTO SignedContract VALUES(6,2,5,10,'checkout',1,1740932163499);
INSERT INTO SignedContract VALUES(7,2,5,10,'checkout',1,1740932279786);
INSERT INTO SignedContract VALUES(8,2,5,10,'checkout',1,1740932460846);
INSERT INTO SignedContract VALUES(9,2,5,10,'checkout',1,1740937319487);
INSERT INTO SignedContract VALUES(10,2,5,10,'checkout',1,1740937398531);
INSERT INTO SignedContract VALUES(11,2,5,10,'checkout',1,1740938154191);
INSERT INTO SignedContract VALUES(12,2,5,10,'checkout',1,1740938276741);
INSERT INTO SignedContract VALUES(13,2,5,10,'checkout',1,1740938990101);
INSERT INTO SignedContract VALUES(14,1,5,10,'checkout',1,1740939526842);
INSERT INTO SignedContract VALUES(15,1,5,10,'checkout',1,1740939600980);
INSERT INTO SignedContract VALUES(16,1,5,10,'checkout',1,1740939655901);
INSERT INTO SignedContract VALUES(17,1,5,10,'checkout',1,1740940506719);
CREATE TABLE IF NOT EXISTS "UserPlan" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userId" INTEGER NOT NULL,
    "contractId" INTEGER,
    "affiliateId" INTEGER NOT NULL,
    "planId" INTEGER NOT NULL,
    "planName" TEXT NOT NULL,
    "validityDays" INTEGER NOT NULL,
    "price" REAL NOT NULL,
    "purchasedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "endDate" DATETIME NOT NULL,
    "sessionsLeft" INTEGER NOT NULL,
    CONSTRAINT "UserPlan_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "UserPlan_contractId_fkey" FOREIGN KEY ("contractId") REFERENCES "Contract" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO UserPlan VALUES(72,5,1,10,0,'MonthlyMembership',31,55.0,1740940506741,1743615306741,994);
INSERT INTO UserPlan VALUES(73,5,NULL,10,1,'Unlimited',99,50.0,1740940540981,1749494140981,9999);
INSERT INTO UserPlan VALUES(74,9,NULL,10,1,'Unlimited',99,50.0,1741116066241,1749669666242,9997);
CREATE TABLE IF NOT EXISTS "ClassSchedule" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "trainingType" TEXT,
    "trainingName" TEXT NOT NULL,
    "time" DATETIME NOT NULL,
    "duration" INTEGER NOT NULL,
    "trainer" TEXT,
    "memberCapacity" INTEGER NOT NULL,
    "location" TEXT,
    "repeatWeekly" BOOLEAN NOT NULL DEFAULT false,
    "ownerId" INTEGER NOT NULL,
    "affiliateId" INTEGER NOT NULL,
    "seriesId" INTEGER,
    "wodName" TEXT,
    "wodType" TEXT,
    "description" TEXT,
    "canRegister" BOOLEAN NOT NULL DEFAULT true,
    "freeClass" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "ClassSchedule_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "ClassSchedule_affiliateId_fkey" FOREIGN KEY ("affiliateId") REFERENCES "Affiliate" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO ClassSchedule VALUES(171,'WOD','CROSSFIT',1738058400000,60,'Karl Sasi',14,'Valge saal',0,6,10,NULL,'AMANDA2','For time','jumpssasd2222',1,0);
INSERT INTO ClassSchedule VALUES(173,'WOD','CROSSFIT',1738623600000,123,'Karl Sasi',22,'Sinine saal',0,6,10,NULL,'','For Time',replace('15-12-9-6-3 reps of:\nDeadlifts (70/100 kg)\n5-4-3-2-1 reps of:\nRope climbs (4.6/4.6 m)','\n',char(10)),1,0);
INSERT INTO ClassSchedule VALUES(174,'Weightlifting','tõstmine',1738158480000,21,'12',12,'12',0,6,10,NULL,'12','For Time',NULL,1,0);
INSERT INTO ClassSchedule VALUES(175,'WOD','CROSSFIT',1738375740000,12,'Karl Sasi',14,'Must saal',0,2,1,NULL,'','For Time',NULL,1,0);
INSERT INTO ClassSchedule VALUES(176,'WOD','CROSSFIT2',1738617240000,12,'',12,'',1,6,10,NULL,'','For Time',replace('15-12-9-6-3 reps of:\nDeadlifts (70/100 kg)\n5-4-3-2-1 reps of:\nRope climbs (4.6/4.6 m)','\n',char(10)),1,0);
INSERT INTO ClassSchedule VALUES(177,'WOD','testgg',1738624620000,12,'',12,'',0,6,10,NULL,'','For Time',replace('15-12-9-6-3 reps of:\nDeadlifts (70/100 kg)\n5-4-3-2-1 reps of:\nRope climbs (4.6/4.6 m)','\n',char(10)),1,0);
INSERT INTO ClassSchedule VALUES(178,'Weightlifting','aaa',1738610280000,12,'',12,'',1,6,10,NULL,'','For Time',NULL,1,0);
INSERT INTO ClassSchedule VALUES(179,'Weightlifting','CROSSFIT',1739181600000,60,'Karl Sasi',14,'Must saal',0,6,10,178,'','For Time',NULL,1,0);
INSERT INTO ClassSchedule VALUES(231,'WOD','CROSSFIT',1738846980000,12,'Karl Sasi',13,'Must saal',1,6,10,NULL,'','For Time',replace('5 rounds for time:\n750-m row\n30 sit-ups\n15 handstand push-ups','\n',char(10)),1,0);
INSERT INTO ClassSchedule VALUES(284,'WOD','CROSSFIT2',1738843800000,12,'Joosep Roosaar',14,'Must saal',0,6,10,NULL,'','For Time',replace('5 rounds for time:\n750-m row\n30 sit-ups\n15 handstand push-ups','\n',char(10)),1,0);
INSERT INTO ClassSchedule VALUES(1345,'WOD','CROSSFIT',1739187300000,12,'',12,'',1,6,10,NULL,'','For Time',NULL,1,0);
INSERT INTO ClassSchedule VALUES(1451,'WOD','CROSSFIT',1739259780000,12,'',12,'',0,6,10,NULL,'','For Time',NULL,1,0);
INSERT INTO ClassSchedule VALUES(1452,'WOD','CROSSFIT',1739864580000,12,'',12,'',1,6,10,1451,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(1453,'WOD','CROSSFIT',1740469380000,12,'',12,'',0,6,10,1451,'','For Time',NULL,1,0);
INSERT INTO ClassSchedule VALUES(1505,'WOD','CROSSFIT',1739878980000,12,'',12,'',1,6,10,1504,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(1506,'WOD','CROSSFIT',1740483780000,12,'',12,'',1,6,10,1504,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(1507,'WOD','CROSSFIT',1741088580000,12,'',12,'',1,6,10,1504,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(1508,'WOD','CROSSFIT',1741693380000,12,'',12,'',1,6,10,1504,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(1509,'WOD','CROSSFIT',1742298180000,12,'',12,'',1,6,10,1504,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(1510,'WOD','CROSSFIT',1742902980000,12,'',12,'',1,6,10,1504,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(1511,'WOD','CROSSFIT',1743504180000,12,'',12,'',1,6,10,1504,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(1512,'WOD','CROSSFIT',1744108980000,12,'',12,'',1,6,10,1504,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(1513,'WOD','CROSSFIT',1744713780000,12,'',12,'',1,6,10,1504,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(1514,'WOD','CROSSFIT',1745318580000,12,'',12,'',1,6,10,1504,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(1515,'WOD','CROSSFIT',1745923380000,12,'',12,'',1,6,10,1504,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(1516,'WOD','CROSSFIT',1746528180000,12,'',12,'',1,6,10,1504,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(1517,'WOD','CROSSFIT',1747132980000,12,'',12,'',1,6,10,1504,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(1518,'WOD','CROSSFIT',1747737780000,12,'',12,'',1,6,10,1504,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(1519,'WOD','CROSSFIT',1748342580000,12,'',12,'',1,6,10,1504,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(1520,'WOD','CROSSFIT',1748947380000,12,'',12,'',1,6,10,1504,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(1521,'WOD','CROSSFIT',1749552180000,12,'',12,'',1,6,10,1504,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(1522,'WOD','CROSSFIT',1750156980000,12,'',12,'',1,6,10,1504,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(1523,'WOD','CROSSFIT',1750761780000,12,'',12,'',1,6,10,1504,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(1524,'WOD','CROSSFIT',1751366580000,12,'',12,'',1,6,10,1504,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(1525,'WOD','CROSSFIT',1751971380000,12,'',12,'',1,6,10,1504,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(1526,'WOD','CROSSFIT',1752576180000,12,'',12,'',1,6,10,1504,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(1527,'WOD','CROSSFIT',1753180980000,12,'',12,'',1,6,10,1504,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(1528,'WOD','CROSSFIT',1753785780000,12,'',12,'',1,6,10,1504,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(1529,'WOD','CROSSFIT',1754390580000,12,'',12,'',1,6,10,1504,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(1530,'WOD','CROSSFIT',1754995380000,12,'',12,'',1,6,10,1504,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(1531,'WOD','CROSSFIT',1755600180000,12,'',12,'',1,6,10,1504,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(1532,'WOD','CROSSFIT',1756204980000,12,'',12,'',1,6,10,1504,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(1533,'WOD','CROSSFIT',1756809780000,12,'',12,'',1,6,10,1504,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(1534,'WOD','CROSSFIT',1757414580000,12,'',12,'',1,6,10,1504,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(1535,'WOD','CROSSFIT',1758019380000,12,'',12,'',1,6,10,1504,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(1536,'WOD','CROSSFIT',1758624180000,12,'',12,'',1,6,10,1504,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(1537,'WOD','CROSSFIT',1759228980000,12,'',12,'',1,6,10,1504,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(1538,'WOD','CROSSFIT',1759833780000,12,'',12,'',1,6,10,1504,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(1539,'WOD','CROSSFIT',1760438580000,12,'',12,'',1,6,10,1504,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(1540,'WOD','CROSSFIT',1761043380000,12,'',12,'',1,6,10,1504,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(1541,'WOD','CROSSFIT',1761651780000,12,'',12,'',1,6,10,1504,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(1542,'WOD','CROSSFIT',1762256580000,12,'',12,'',1,6,10,1504,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(1543,'WOD','CROSSFIT',1762861380000,12,'',12,'',1,6,10,1504,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(1544,'WOD','CROSSFIT',1763466180000,12,'',12,'',1,6,10,1504,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(1545,'WOD','CROSSFIT',1764070980000,12,'',12,'',1,6,10,1504,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(1546,'WOD','CROSSFIT',1764675780000,12,'',12,'',1,6,10,1504,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(1547,'WOD','CROSSFIT',1765280580000,12,'',12,'',1,6,10,1504,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(1548,'WOD','CROSSFIT',1765885380000,12,'',12,'',1,6,10,1504,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(1549,'WOD','CROSSFIT',1766490180000,12,'',12,'',1,6,10,1504,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(1550,'WOD','CROSSFIT',1767094980000,12,'',12,'',1,6,10,1504,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(1551,'WOD','CROSSFIT',1767699780000,12,'',12,'',1,6,10,1504,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(1552,'WOD','CROSSFIT',1768304580000,12,'',12,'',1,6,10,1504,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(1553,'WOD','CROSSFIT',1768909380000,12,'',12,'',1,6,10,1504,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(1554,'WOD','CROSSFIT',1769514180000,12,'',12,'',1,6,10,1504,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(1555,'WOD','CROSSFIT',1770118980000,12,'',12,'',1,6,10,1504,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(1556,'WOD','CROSSFIT',1770723780000,12,'',12,'',1,6,10,1504,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(1557,'WOD','CROSSFIT',1741679220000,12,'',12,'',0,6,10,NULL,'','For Time',NULL,1,0);
INSERT INTO ClassSchedule VALUES(1558,'WOD','CROSSFIT',1742284020000,12,'',12,'',0,6,10,1557,'','For Time',NULL,1,0);
INSERT INTO ClassSchedule VALUES(1610,'WOD','CROSSFIT',1739440800000,60,'Karl Sasi',14,'Must saal',1,6,10,NULL,'','EMOM',replace('Every 2:00 for 10 rounds for load:\n10 box jumps (51/61 cm)\n3 hang squat cleans\n– Step down from the box.\nScore: Load','\n',char(10)),1,0);
INSERT INTO ClassSchedule VALUES(1611,'WOD','CROSSFIT',1740045600000,60,'Karl Sasi',14,'Must saal',1,6,10,1610,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(1612,'WOD','CROSSFIT',1740650400000,60,'Karl Sasi',14,'Must saal',1,6,10,1610,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(1613,'WOD','CROSSFIT',1741255200000,60,'Karl Sasi',14,'Must saal',1,6,10,1610,'KELLIKAS','EMOM',replace('For load:\nEMOM 12:\n3 power cleans\n2 hang power cleans\n1 push jerk\n– Build in load.\n\nPost-workout\nOn an 8:00 clock:\nRow, bike, or ski','\n',char(10)),1,0);
INSERT INTO ClassSchedule VALUES(1614,'WOD','CROSSFIT',1741860000000,60,'Karl Sasi',14,'Must saal',1,6,10,1610,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(1615,'WOD','CROSSFIT',1742464800000,60,'Karl Sasi',14,'Must saal',1,6,10,1610,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(1616,'WOD','CROSSFIT',1743069600000,60,'Karl Sasi',14,'Must saal',1,6,10,1610,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(1617,'WOD','CROSSFIT',1743670800000,60,'Karl Sasi',14,'Must saal',1,6,10,1610,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(1618,'WOD','CROSSFIT',1744275600000,60,'Karl Sasi',14,'Must saal',1,6,10,1610,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(1619,'WOD','CROSSFIT',1744880400000,60,'Karl Sasi',14,'Must saal',1,6,10,1610,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(1620,'WOD','CROSSFIT',1745485200000,60,'Karl Sasi',14,'Must saal',1,6,10,1610,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(1621,'WOD','CROSSFIT',1746090000000,60,'Karl Sasi',14,'Must saal',1,6,10,1610,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(1622,'WOD','CROSSFIT',1746694800000,60,'Karl Sasi',14,'Must saal',1,6,10,1610,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(1623,'WOD','CROSSFIT',1747299600000,60,'Karl Sasi',14,'Must saal',1,6,10,1610,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(1624,'WOD','CROSSFIT',1747904400000,60,'Karl Sasi',14,'Must saal',1,6,10,1610,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(1625,'WOD','CROSSFIT',1748509200000,60,'Karl Sasi',14,'Must saal',1,6,10,1610,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(1626,'WOD','CROSSFIT',1749114000000,60,'Karl Sasi',14,'Must saal',1,6,10,1610,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(1627,'WOD','CROSSFIT',1749718800000,60,'Karl Sasi',14,'Must saal',1,6,10,1610,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(1628,'WOD','CROSSFIT',1750323600000,60,'Karl Sasi',14,'Must saal',1,6,10,1610,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(1629,'WOD','CROSSFIT',1750928400000,60,'Karl Sasi',14,'Must saal',1,6,10,1610,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(1630,'WOD','CROSSFIT',1751533200000,60,'Karl Sasi',14,'Must saal',1,6,10,1610,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(1631,'WOD','CROSSFIT',1752138000000,60,'Karl Sasi',14,'Must saal',1,6,10,1610,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(1632,'WOD','CROSSFIT',1752742800000,60,'Karl Sasi',14,'Must saal',1,6,10,1610,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(1633,'WOD','CROSSFIT',1753347600000,60,'Karl Sasi',14,'Must saal',1,6,10,1610,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(1634,'WOD','CROSSFIT',1753952400000,60,'Karl Sasi',14,'Must saal',1,6,10,1610,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(1635,'WOD','CROSSFIT',1754557200000,60,'Karl Sasi',14,'Must saal',1,6,10,1610,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(1636,'WOD','CROSSFIT',1755162000000,60,'Karl Sasi',14,'Must saal',1,6,10,1610,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(1637,'WOD','CROSSFIT',1755766800000,60,'Karl Sasi',14,'Must saal',1,6,10,1610,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(1638,'WOD','CROSSFIT',1756371600000,60,'Karl Sasi',14,'Must saal',1,6,10,1610,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(1639,'WOD','CROSSFIT',1756976400000,60,'Karl Sasi',14,'Must saal',1,6,10,1610,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(1640,'WOD','CROSSFIT',1757581200000,60,'Karl Sasi',14,'Must saal',1,6,10,1610,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(1641,'WOD','CROSSFIT',1758186000000,60,'Karl Sasi',14,'Must saal',1,6,10,1610,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(1642,'WOD','CROSSFIT',1758790800000,60,'Karl Sasi',14,'Must saal',1,6,10,1610,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(1643,'WOD','CROSSFIT',1759395600000,60,'Karl Sasi',14,'Must saal',1,6,10,1610,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(1644,'WOD','CROSSFIT',1760000400000,60,'Karl Sasi',14,'Must saal',1,6,10,1610,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(1645,'WOD','CROSSFIT',1760605200000,60,'Karl Sasi',14,'Must saal',1,6,10,1610,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(1646,'WOD','CROSSFIT',1761210000000,60,'Karl Sasi',14,'Must saal',1,6,10,1610,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(1647,'WOD','CROSSFIT',1761818400000,60,'Karl Sasi',14,'Must saal',1,6,10,1610,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(1648,'WOD','CROSSFIT',1762423200000,60,'Karl Sasi',14,'Must saal',1,6,10,1610,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(1649,'WOD','CROSSFIT',1763028000000,60,'Karl Sasi',14,'Must saal',1,6,10,1610,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(1650,'WOD','CROSSFIT',1763632800000,60,'Karl Sasi',14,'Must saal',1,6,10,1610,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(1651,'WOD','CROSSFIT',1764237600000,60,'Karl Sasi',14,'Must saal',1,6,10,1610,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(1652,'WOD','CROSSFIT',1764842400000,60,'Karl Sasi',14,'Must saal',1,6,10,1610,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(1653,'WOD','CROSSFIT',1765447200000,60,'Karl Sasi',14,'Must saal',1,6,10,1610,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(1654,'WOD','CROSSFIT',1766052000000,60,'Karl Sasi',14,'Must saal',1,6,10,1610,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(1655,'WOD','CROSSFIT',1766656800000,60,'Karl Sasi',14,'Must saal',1,6,10,1610,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(1656,'WOD','CROSSFIT',1767261600000,60,'Karl Sasi',14,'Must saal',1,6,10,1610,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(1657,'WOD','CROSSFIT',1767866400000,60,'Karl Sasi',14,'Must saal',1,6,10,1610,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(1658,'WOD','CROSSFIT',1768471200000,60,'Karl Sasi',14,'Must saal',1,6,10,1610,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(1659,'WOD','CROSSFIT',1769076000000,60,'Karl Sasi',14,'Must saal',1,6,10,1610,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(1660,'WOD','CROSSFIT',1769680800000,60,'Karl Sasi',14,'Must saal',1,6,10,1610,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(1661,'WOD','CROSSFIT',1770285600000,60,'Karl Sasi',14,'Must saal',1,6,10,1610,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(1662,'WOD','CROSSFIT',1770890400000,60,'Karl Sasi',14,'Must saal',1,6,10,1610,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(1663,'WOD','CROSSFIT',1739457000000,60,'Karl Sasi',14,'Must saal',1,6,10,NULL,'','EMOM',replace('Every 2:00 for 10 rounds for load:\n10 box jumps (51/61 cm)\n3 hang squat cleans\n– Step down from the box.\nScore: Load','\n',char(10)),1,0);
INSERT INTO ClassSchedule VALUES(1664,'WOD','CROSSFIT',1740061800000,60,'Karl Sasi',14,'Must saal',1,6,10,1663,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(1665,'WOD','CROSSFIT',1740666600000,60,'Karl Sasi',14,'Must saal',1,6,10,1663,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(1666,'WOD','CROSSFIT',1741271400000,60,'Karl Sasi',14,'Must saal',1,6,10,1663,'KELLIKAS','EMOM',replace('For load:\nEMOM 12:\n3 power cleans\n2 hang power cleans\n1 push jerk\n– Build in load.\n\nPost-workout\nOn an 8:00 clock:\nRow, bike, or ski','\n',char(10)),1,0);
INSERT INTO ClassSchedule VALUES(1667,'WOD','CROSSFIT',1741876200000,60,'Karl Sasi',14,'Must saal',1,6,10,1663,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(1668,'WOD','CROSSFIT',1742481000000,60,'Karl Sasi',14,'Must saal',1,6,10,1663,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(1669,'WOD','CROSSFIT',1743085800000,60,'Karl Sasi',14,'Must saal',1,6,10,1663,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(1670,'WOD','CROSSFIT',1743687000000,60,'Karl Sasi',14,'Must saal',1,6,10,1663,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(1671,'WOD','CROSSFIT',1744291800000,60,'Karl Sasi',14,'Must saal',1,6,10,1663,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(1672,'WOD','CROSSFIT',1744896600000,60,'Karl Sasi',14,'Must saal',1,6,10,1663,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(1673,'WOD','CROSSFIT',1745501400000,60,'Karl Sasi',14,'Must saal',1,6,10,1663,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(1674,'WOD','CROSSFIT',1746106200000,60,'Karl Sasi',14,'Must saal',1,6,10,1663,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(1675,'WOD','CROSSFIT',1746711000000,60,'Karl Sasi',14,'Must saal',1,6,10,1663,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(1676,'WOD','CROSSFIT',1747315800000,60,'Karl Sasi',14,'Must saal',1,6,10,1663,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(1677,'WOD','CROSSFIT',1747920600000,60,'Karl Sasi',14,'Must saal',1,6,10,1663,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(1678,'WOD','CROSSFIT',1748525400000,60,'Karl Sasi',14,'Must saal',1,6,10,1663,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(1679,'WOD','CROSSFIT',1749130200000,60,'Karl Sasi',14,'Must saal',1,6,10,1663,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(1680,'WOD','CROSSFIT',1749735000000,60,'Karl Sasi',14,'Must saal',1,6,10,1663,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(1681,'WOD','CROSSFIT',1750339800000,60,'Karl Sasi',14,'Must saal',1,6,10,1663,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(1682,'WOD','CROSSFIT',1750944600000,60,'Karl Sasi',14,'Must saal',1,6,10,1663,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(1683,'WOD','CROSSFIT',1751549400000,60,'Karl Sasi',14,'Must saal',1,6,10,1663,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(1684,'WOD','CROSSFIT',1752154200000,60,'Karl Sasi',14,'Must saal',1,6,10,1663,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(1685,'WOD','CROSSFIT',1752759000000,60,'Karl Sasi',14,'Must saal',1,6,10,1663,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(1686,'WOD','CROSSFIT',1753363800000,60,'Karl Sasi',14,'Must saal',1,6,10,1663,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(1687,'WOD','CROSSFIT',1753968600000,60,'Karl Sasi',14,'Must saal',1,6,10,1663,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(1688,'WOD','CROSSFIT',1754573400000,60,'Karl Sasi',14,'Must saal',1,6,10,1663,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(1689,'WOD','CROSSFIT',1755178200000,60,'Karl Sasi',14,'Must saal',1,6,10,1663,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(1690,'WOD','CROSSFIT',1755783000000,60,'Karl Sasi',14,'Must saal',1,6,10,1663,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(1691,'WOD','CROSSFIT',1756387800000,60,'Karl Sasi',14,'Must saal',1,6,10,1663,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(1692,'WOD','CROSSFIT',1756992600000,60,'Karl Sasi',14,'Must saal',1,6,10,1663,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(1693,'WOD','CROSSFIT',1757597400000,60,'Karl Sasi',14,'Must saal',1,6,10,1663,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(1694,'WOD','CROSSFIT',1758202200000,60,'Karl Sasi',14,'Must saal',1,6,10,1663,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(1695,'WOD','CROSSFIT',1758807000000,60,'Karl Sasi',14,'Must saal',1,6,10,1663,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(1696,'WOD','CROSSFIT',1759411800000,60,'Karl Sasi',14,'Must saal',1,6,10,1663,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(1697,'WOD','CROSSFIT',1760016600000,60,'Karl Sasi',14,'Must saal',1,6,10,1663,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(1698,'WOD','CROSSFIT',1760621400000,60,'Karl Sasi',14,'Must saal',1,6,10,1663,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(1699,'WOD','CROSSFIT',1761226200000,60,'Karl Sasi',14,'Must saal',1,6,10,1663,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(1700,'WOD','CROSSFIT',1761834600000,60,'Karl Sasi',14,'Must saal',1,6,10,1663,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(1701,'WOD','CROSSFIT',1762439400000,60,'Karl Sasi',14,'Must saal',1,6,10,1663,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(1702,'WOD','CROSSFIT',1763044200000,60,'Karl Sasi',14,'Must saal',1,6,10,1663,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(1703,'WOD','CROSSFIT',1763649000000,60,'Karl Sasi',14,'Must saal',1,6,10,1663,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(1704,'WOD','CROSSFIT',1764253800000,60,'Karl Sasi',14,'Must saal',1,6,10,1663,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(1705,'WOD','CROSSFIT',1764858600000,60,'Karl Sasi',14,'Must saal',1,6,10,1663,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(1706,'WOD','CROSSFIT',1765463400000,60,'Karl Sasi',14,'Must saal',1,6,10,1663,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(1707,'WOD','CROSSFIT',1766068200000,60,'Karl Sasi',14,'Must saal',1,6,10,1663,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(1708,'WOD','CROSSFIT',1766673000000,60,'Karl Sasi',14,'Must saal',1,6,10,1663,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(1709,'WOD','CROSSFIT',1767277800000,60,'Karl Sasi',14,'Must saal',1,6,10,1663,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(1710,'WOD','CROSSFIT',1767882600000,60,'Karl Sasi',14,'Must saal',1,6,10,1663,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(1711,'WOD','CROSSFIT',1768487400000,60,'Karl Sasi',14,'Must saal',1,6,10,1663,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(1712,'WOD','CROSSFIT',1769092200000,60,'Karl Sasi',14,'Must saal',1,6,10,1663,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(1713,'WOD','CROSSFIT',1769697000000,60,'Karl Sasi',14,'Must saal',1,6,10,1663,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(1714,'WOD','CROSSFIT',1770301800000,60,'Karl Sasi',14,'Must saal',1,6,10,1663,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(1715,'WOD','CROSSFIT',1770906600000,60,'Karl Sasi',14,'Must saal',1,6,10,1663,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(1716,'WOD','CROSSFIT',1739460600000,60,'Karl Sasi',14,'Must saal',1,6,10,NULL,'','EMOM',replace('Every 2:00 for 10 rounds for load:\n10 box jumps (51/61 cm)\n3 hang squat cleans\n– Step down from the box.\nScore: Load','\n',char(10)),1,0);
INSERT INTO ClassSchedule VALUES(1717,'WOD','CROSSFIT',1740065400000,60,'Karl Sasi',14,'Must saal',1,6,10,1716,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(1718,'WOD','CROSSFIT',1740670200000,60,'Karl Sasi',14,'Must saal',1,6,10,1716,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(1719,'WOD','CROSSFIT',1741275000000,60,'Karl Sasi',14,'Must saal',1,6,10,1716,'KELLIKAS','EMOM',replace('For load:\nEMOM 12:\n3 power cleans\n2 hang power cleans\n1 push jerk\n– Build in load.\n\nPost-workout\nOn an 8:00 clock:\nRow, bike, or ski','\n',char(10)),1,0);
INSERT INTO ClassSchedule VALUES(1720,'WOD','CROSSFIT',1741879800000,60,'Karl Sasi',14,'Must saal',1,6,10,1716,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(1721,'WOD','CROSSFIT',1742484600000,60,'Karl Sasi',14,'Must saal',1,6,10,1716,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(1722,'WOD','CROSSFIT',1743089400000,60,'Karl Sasi',14,'Must saal',1,6,10,1716,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(1723,'WOD','CROSSFIT',1743690600000,60,'Karl Sasi',14,'Must saal',1,6,10,1716,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(1724,'WOD','CROSSFIT',1744295400000,60,'Karl Sasi',14,'Must saal',1,6,10,1716,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(1725,'WOD','CROSSFIT',1744900200000,60,'Karl Sasi',14,'Must saal',1,6,10,1716,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(1726,'WOD','CROSSFIT',1745505000000,60,'Karl Sasi',14,'Must saal',1,6,10,1716,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(1727,'WOD','CROSSFIT',1746109800000,60,'Karl Sasi',14,'Must saal',1,6,10,1716,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(1728,'WOD','CROSSFIT',1746714600000,60,'Karl Sasi',14,'Must saal',1,6,10,1716,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(1729,'WOD','CROSSFIT',1747319400000,60,'Karl Sasi',14,'Must saal',1,6,10,1716,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(1730,'WOD','CROSSFIT',1747924200000,60,'Karl Sasi',14,'Must saal',1,6,10,1716,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(1731,'WOD','CROSSFIT',1748529000000,60,'Karl Sasi',14,'Must saal',1,6,10,1716,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(1732,'WOD','CROSSFIT',1749133800000,60,'Karl Sasi',14,'Must saal',1,6,10,1716,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(1733,'WOD','CROSSFIT',1749738600000,60,'Karl Sasi',14,'Must saal',1,6,10,1716,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(1734,'WOD','CROSSFIT',1750343400000,60,'Karl Sasi',14,'Must saal',1,6,10,1716,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(1735,'WOD','CROSSFIT',1750948200000,60,'Karl Sasi',14,'Must saal',1,6,10,1716,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(1736,'WOD','CROSSFIT',1751553000000,60,'Karl Sasi',14,'Must saal',1,6,10,1716,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(1737,'WOD','CROSSFIT',1752157800000,60,'Karl Sasi',14,'Must saal',1,6,10,1716,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(1738,'WOD','CROSSFIT',1752762600000,60,'Karl Sasi',14,'Must saal',1,6,10,1716,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(1739,'WOD','CROSSFIT',1753367400000,60,'Karl Sasi',14,'Must saal',1,6,10,1716,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(1740,'WOD','CROSSFIT',1753972200000,60,'Karl Sasi',14,'Must saal',1,6,10,1716,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(1741,'WOD','CROSSFIT',1754577000000,60,'Karl Sasi',14,'Must saal',1,6,10,1716,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(1742,'WOD','CROSSFIT',1755181800000,60,'Karl Sasi',14,'Must saal',1,6,10,1716,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(1743,'WOD','CROSSFIT',1755786600000,60,'Karl Sasi',14,'Must saal',1,6,10,1716,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(1744,'WOD','CROSSFIT',1756391400000,60,'Karl Sasi',14,'Must saal',1,6,10,1716,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(1745,'WOD','CROSSFIT',1756996200000,60,'Karl Sasi',14,'Must saal',1,6,10,1716,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(1746,'WOD','CROSSFIT',1757601000000,60,'Karl Sasi',14,'Must saal',1,6,10,1716,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(1747,'WOD','CROSSFIT',1758205800000,60,'Karl Sasi',14,'Must saal',1,6,10,1716,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(1748,'WOD','CROSSFIT',1758810600000,60,'Karl Sasi',14,'Must saal',1,6,10,1716,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(1749,'WOD','CROSSFIT',1759415400000,60,'Karl Sasi',14,'Must saal',1,6,10,1716,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(1750,'WOD','CROSSFIT',1760020200000,60,'Karl Sasi',14,'Must saal',1,6,10,1716,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(1751,'WOD','CROSSFIT',1760625000000,60,'Karl Sasi',14,'Must saal',1,6,10,1716,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(1752,'WOD','CROSSFIT',1761229800000,60,'Karl Sasi',14,'Must saal',1,6,10,1716,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(1753,'WOD','CROSSFIT',1761838200000,60,'Karl Sasi',14,'Must saal',1,6,10,1716,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(1754,'WOD','CROSSFIT',1762443000000,60,'Karl Sasi',14,'Must saal',1,6,10,1716,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(1755,'WOD','CROSSFIT',1763047800000,60,'Karl Sasi',14,'Must saal',1,6,10,1716,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(1756,'WOD','CROSSFIT',1763652600000,60,'Karl Sasi',14,'Must saal',1,6,10,1716,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(1757,'WOD','CROSSFIT',1764257400000,60,'Karl Sasi',14,'Must saal',1,6,10,1716,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(1758,'WOD','CROSSFIT',1764862200000,60,'Karl Sasi',14,'Must saal',1,6,10,1716,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(1759,'WOD','CROSSFIT',1765467000000,60,'Karl Sasi',14,'Must saal',1,6,10,1716,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(1760,'WOD','CROSSFIT',1766071800000,60,'Karl Sasi',14,'Must saal',1,6,10,1716,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(1761,'WOD','CROSSFIT',1766676600000,60,'Karl Sasi',14,'Must saal',1,6,10,1716,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(1762,'WOD','CROSSFIT',1767281400000,60,'Karl Sasi',14,'Must saal',1,6,10,1716,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(1763,'WOD','CROSSFIT',1767886200000,60,'Karl Sasi',14,'Must saal',1,6,10,1716,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(1764,'WOD','CROSSFIT',1768491000000,60,'Karl Sasi',14,'Must saal',1,6,10,1716,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(1765,'WOD','CROSSFIT',1769095800000,60,'Karl Sasi',14,'Must saal',1,6,10,1716,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(1766,'WOD','CROSSFIT',1769700600000,60,'Karl Sasi',14,'Must saal',1,6,10,1716,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(1767,'WOD','CROSSFIT',1770305400000,60,'Karl Sasi',14,'Must saal',1,6,10,1716,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(1768,'WOD','CROSSFIT',1770910200000,60,'Karl Sasi',14,'Must saal',1,6,10,1716,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(1769,'WOD','CROSSFIT',1739464200000,60,'Karl Sasi',14,'Must saal',1,6,10,NULL,'','EMOM',replace('Every 2:00 for 10 rounds for load:\n10 box jumps (51/61 cm)\n3 hang squat cleans\n– Step down from the box.\nScore: Load','\n',char(10)),1,0);
INSERT INTO ClassSchedule VALUES(1770,'WOD','CROSSFIT',1740069000000,60,'Karl Sasi',14,'Must saal',1,6,10,1769,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(1771,'WOD','CROSSFIT',1740673800000,60,'Karl Sasi',14,'Must saal',1,6,10,1769,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(1772,'WOD','CROSSFIT',1741278600000,60,'Karl Sasi',14,'Must saal',1,6,10,1769,'KELLIKAS','EMOM',replace('For load:\nEMOM 12:\n3 power cleans\n2 hang power cleans\n1 push jerk\n– Build in load.\n\nPost-workout\nOn an 8:00 clock:\nRow, bike, or ski','\n',char(10)),1,0);
INSERT INTO ClassSchedule VALUES(1773,'WOD','CROSSFIT',1741883400000,60,'Karl Sasi',14,'Must saal',1,6,10,1769,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(1774,'WOD','CROSSFIT',1742488200000,60,'Karl Sasi',14,'Must saal',1,6,10,1769,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(1775,'WOD','CROSSFIT',1743093000000,60,'Karl Sasi',14,'Must saal',1,6,10,1769,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(1776,'WOD','CROSSFIT',1743694200000,60,'Karl Sasi',14,'Must saal',1,6,10,1769,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(1777,'WOD','CROSSFIT',1744299000000,60,'Karl Sasi',14,'Must saal',1,6,10,1769,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(1778,'WOD','CROSSFIT',1744903800000,60,'Karl Sasi',14,'Must saal',1,6,10,1769,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(1779,'WOD','CROSSFIT',1745508600000,60,'Karl Sasi',14,'Must saal',1,6,10,1769,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(1780,'WOD','CROSSFIT',1746113400000,60,'Karl Sasi',14,'Must saal',1,6,10,1769,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(1781,'WOD','CROSSFIT',1746718200000,60,'Karl Sasi',14,'Must saal',1,6,10,1769,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(1782,'WOD','CROSSFIT',1747323000000,60,'Karl Sasi',14,'Must saal',1,6,10,1769,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(1783,'WOD','CROSSFIT',1747927800000,60,'Karl Sasi',14,'Must saal',1,6,10,1769,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(1784,'WOD','CROSSFIT',1748532600000,60,'Karl Sasi',14,'Must saal',1,6,10,1769,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(1785,'WOD','CROSSFIT',1749137400000,60,'Karl Sasi',14,'Must saal',1,6,10,1769,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(1786,'WOD','CROSSFIT',1749742200000,60,'Karl Sasi',14,'Must saal',1,6,10,1769,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(1787,'WOD','CROSSFIT',1750347000000,60,'Karl Sasi',14,'Must saal',1,6,10,1769,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(1788,'WOD','CROSSFIT',1750951800000,60,'Karl Sasi',14,'Must saal',1,6,10,1769,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(1789,'WOD','CROSSFIT',1751556600000,60,'Karl Sasi',14,'Must saal',1,6,10,1769,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(1790,'WOD','CROSSFIT',1752161400000,60,'Karl Sasi',14,'Must saal',1,6,10,1769,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(1791,'WOD','CROSSFIT',1752766200000,60,'Karl Sasi',14,'Must saal',1,6,10,1769,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(1792,'WOD','CROSSFIT',1753371000000,60,'Karl Sasi',14,'Must saal',1,6,10,1769,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(1793,'WOD','CROSSFIT',1753975800000,60,'Karl Sasi',14,'Must saal',1,6,10,1769,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(1794,'WOD','CROSSFIT',1754580600000,60,'Karl Sasi',14,'Must saal',1,6,10,1769,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(1795,'WOD','CROSSFIT',1755185400000,60,'Karl Sasi',14,'Must saal',1,6,10,1769,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(1796,'WOD','CROSSFIT',1755790200000,60,'Karl Sasi',14,'Must saal',1,6,10,1769,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(1797,'WOD','CROSSFIT',1756395000000,60,'Karl Sasi',14,'Must saal',1,6,10,1769,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(1798,'WOD','CROSSFIT',1756999800000,60,'Karl Sasi',14,'Must saal',1,6,10,1769,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(1799,'WOD','CROSSFIT',1757604600000,60,'Karl Sasi',14,'Must saal',1,6,10,1769,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(1800,'WOD','CROSSFIT',1758209400000,60,'Karl Sasi',14,'Must saal',1,6,10,1769,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(1801,'WOD','CROSSFIT',1758814200000,60,'Karl Sasi',14,'Must saal',1,6,10,1769,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(1802,'WOD','CROSSFIT',1759419000000,60,'Karl Sasi',14,'Must saal',1,6,10,1769,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(1803,'WOD','CROSSFIT',1760023800000,60,'Karl Sasi',14,'Must saal',1,6,10,1769,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(1804,'WOD','CROSSFIT',1760628600000,60,'Karl Sasi',14,'Must saal',1,6,10,1769,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(1805,'WOD','CROSSFIT',1761233400000,60,'Karl Sasi',14,'Must saal',1,6,10,1769,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(1806,'WOD','CROSSFIT',1761841800000,60,'Karl Sasi',14,'Must saal',1,6,10,1769,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(1807,'WOD','CROSSFIT',1762446600000,60,'Karl Sasi',14,'Must saal',1,6,10,1769,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(1808,'WOD','CROSSFIT',1763051400000,60,'Karl Sasi',14,'Must saal',1,6,10,1769,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(1809,'WOD','CROSSFIT',1763656200000,60,'Karl Sasi',14,'Must saal',1,6,10,1769,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(1810,'WOD','CROSSFIT',1764261000000,60,'Karl Sasi',14,'Must saal',1,6,10,1769,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(1811,'WOD','CROSSFIT',1764865800000,60,'Karl Sasi',14,'Must saal',1,6,10,1769,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(1812,'WOD','CROSSFIT',1765470600000,60,'Karl Sasi',14,'Must saal',1,6,10,1769,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(1813,'WOD','CROSSFIT',1766075400000,60,'Karl Sasi',14,'Must saal',1,6,10,1769,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(1814,'WOD','CROSSFIT',1766680200000,60,'Karl Sasi',14,'Must saal',1,6,10,1769,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(1815,'WOD','CROSSFIT',1767285000000,60,'Karl Sasi',14,'Must saal',1,6,10,1769,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(1816,'WOD','CROSSFIT',1767889800000,60,'Karl Sasi',14,'Must saal',1,6,10,1769,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(1817,'WOD','CROSSFIT',1768494600000,60,'Karl Sasi',14,'Must saal',1,6,10,1769,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(1818,'WOD','CROSSFIT',1769099400000,60,'Karl Sasi',14,'Must saal',1,6,10,1769,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(1819,'WOD','CROSSFIT',1769704200000,60,'Karl Sasi',14,'Must saal',1,6,10,1769,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(1820,'WOD','CROSSFIT',1770309000000,60,'Karl Sasi',14,'Must saal',1,6,10,1769,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(1821,'WOD','CROSSFIT',1770913800000,60,'Karl Sasi',14,'Must saal',1,6,10,1769,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(1822,'Other','Open Gym',1739437200000,120,'Karl Sasi',10,'',1,6,10,NULL,'','For Time',NULL,1,0);
INSERT INTO ClassSchedule VALUES(1823,'Other','Open Gym',1740042000000,120,'Karl Sasi',10,'',1,6,10,1822,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(1824,'Other','Open Gym',1740646800000,120,'Karl Sasi',10,'',1,6,10,1822,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(1825,'Other','Open Gym',1741251600000,120,'Karl Sasi',1,'',1,6,10,1822,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(1826,'Other','Open Gym',1741856400000,120,'Karl Sasi',10,'',1,6,10,1822,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(1827,'Other','Open Gym',1742461200000,120,'Karl Sasi',10,'',1,6,10,1822,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(1828,'Other','Open Gym',1743066000000,120,'Karl Sasi',10,'',1,6,10,1822,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(1829,'Other','Open Gym',1743667200000,120,'Karl Sasi',10,'',1,6,10,1822,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(1830,'Other','Open Gym',1744272000000,120,'Karl Sasi',10,'',1,6,10,1822,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(1831,'Other','Open Gym',1744876800000,120,'Karl Sasi',10,'',1,6,10,1822,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(1832,'Other','Open Gym',1745481600000,120,'Karl Sasi',10,'',1,6,10,1822,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(1833,'Other','Open Gym',1746086400000,120,'Karl Sasi',10,'',1,6,10,1822,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(1834,'Other','Open Gym',1746691200000,120,'Karl Sasi',10,'',1,6,10,1822,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(1835,'Other','Open Gym',1747296000000,120,'Karl Sasi',10,'',1,6,10,1822,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(1836,'Other','Open Gym',1747900800000,120,'Karl Sasi',10,'',1,6,10,1822,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(1837,'Other','Open Gym',1748505600000,120,'Karl Sasi',10,'',1,6,10,1822,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(1838,'Other','Open Gym',1749110400000,120,'Karl Sasi',10,'',1,6,10,1822,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(1839,'Other','Open Gym',1749715200000,120,'Karl Sasi',10,'',1,6,10,1822,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(1840,'Other','Open Gym',1750320000000,120,'Karl Sasi',10,'',1,6,10,1822,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(1841,'Other','Open Gym',1750924800000,120,'Karl Sasi',10,'',1,6,10,1822,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(1842,'Other','Open Gym',1751529600000,120,'Karl Sasi',10,'',1,6,10,1822,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(1843,'Other','Open Gym',1752134400000,120,'Karl Sasi',10,'',1,6,10,1822,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(1844,'Other','Open Gym',1752739200000,120,'Karl Sasi',10,'',1,6,10,1822,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(1845,'Other','Open Gym',1753344000000,120,'Karl Sasi',10,'',1,6,10,1822,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(1846,'Other','Open Gym',1753948800000,120,'Karl Sasi',10,'',1,6,10,1822,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(1847,'Other','Open Gym',1754553600000,120,'Karl Sasi',10,'',1,6,10,1822,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(1848,'Other','Open Gym',1755158400000,120,'Karl Sasi',10,'',1,6,10,1822,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(1849,'Other','Open Gym',1755763200000,120,'Karl Sasi',10,'',1,6,10,1822,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(1850,'Other','Open Gym',1756368000000,120,'Karl Sasi',10,'',1,6,10,1822,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(1851,'Other','Open Gym',1756972800000,120,'Karl Sasi',10,'',1,6,10,1822,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(1852,'Other','Open Gym',1757577600000,120,'Karl Sasi',10,'',1,6,10,1822,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(1853,'Other','Open Gym',1758182400000,120,'Karl Sasi',10,'',1,6,10,1822,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(1854,'Other','Open Gym',1758787200000,120,'Karl Sasi',10,'',1,6,10,1822,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(1855,'Other','Open Gym',1759392000000,120,'Karl Sasi',10,'',1,6,10,1822,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(1856,'Other','Open Gym',1759996800000,120,'Karl Sasi',10,'',1,6,10,1822,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(1857,'Other','Open Gym',1760601600000,120,'Karl Sasi',10,'',1,6,10,1822,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(1858,'Other','Open Gym',1761206400000,120,'Karl Sasi',10,'',1,6,10,1822,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(1859,'Other','Open Gym',1761814800000,120,'Karl Sasi',10,'',1,6,10,1822,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(1860,'Other','Open Gym',1762419600000,120,'Karl Sasi',10,'',1,6,10,1822,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(1861,'Other','Open Gym',1763024400000,120,'Karl Sasi',10,'',1,6,10,1822,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(1862,'Other','Open Gym',1763629200000,120,'Karl Sasi',10,'',1,6,10,1822,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(1863,'Other','Open Gym',1764234000000,120,'Karl Sasi',10,'',1,6,10,1822,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(1864,'Other','Open Gym',1764838800000,120,'Karl Sasi',10,'',1,6,10,1822,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(1865,'Other','Open Gym',1765443600000,120,'Karl Sasi',10,'',1,6,10,1822,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(1866,'Other','Open Gym',1766048400000,120,'Karl Sasi',10,'',1,6,10,1822,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(1867,'Other','Open Gym',1766653200000,120,'Karl Sasi',10,'',1,6,10,1822,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(1868,'Other','Open Gym',1767258000000,120,'Karl Sasi',10,'',1,6,10,1822,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(1869,'Other','Open Gym',1767862800000,120,'Karl Sasi',10,'',1,6,10,1822,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(1870,'Other','Open Gym',1768467600000,120,'Karl Sasi',10,'',1,6,10,1822,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(1871,'Other','Open Gym',1769072400000,120,'Karl Sasi',10,'',1,6,10,1822,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(1872,'Other','Open Gym',1769677200000,120,'Karl Sasi',10,'',1,6,10,1822,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(1873,'Other','Open Gym',1770282000000,120,'Karl Sasi',10,'',1,6,10,1822,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(1874,'Other','Open Gym',1770886800000,120,'Karl Sasi',10,'',1,6,10,1822,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(1875,'Other','Open Gym',1739444400000,120,'Karl Sasi',10,'',1,6,10,NULL,'','For Time',NULL,1,0);
INSERT INTO ClassSchedule VALUES(1876,'Other','Open Gym',1740049200000,120,'Karl Sasi',10,'',1,6,10,1875,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(1877,'Other','Open Gym',1740654000000,120,'Karl Sasi',10,'',1,6,10,1875,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(1878,'Other','Open Gym',1741258800000,120,'Karl Sasi',10,'',1,6,10,1875,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(1879,'Other','Open Gym',1741863600000,120,'Karl Sasi',10,'',1,6,10,1875,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(1880,'Other','Open Gym',1742468400000,120,'Karl Sasi',10,'',1,6,10,1875,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(1881,'Other','Open Gym',1743073200000,120,'Karl Sasi',10,'',1,6,10,1875,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(1882,'Other','Open Gym',1743674400000,120,'Karl Sasi',10,'',1,6,10,1875,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(1883,'Other','Open Gym',1744279200000,120,'Karl Sasi',10,'',1,6,10,1875,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(1884,'Other','Open Gym',1744884000000,120,'Karl Sasi',10,'',1,6,10,1875,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(1885,'Other','Open Gym',1745488800000,120,'Karl Sasi',10,'',1,6,10,1875,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(1886,'Other','Open Gym',1746093600000,120,'Karl Sasi',10,'',1,6,10,1875,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(1887,'Other','Open Gym',1746698400000,120,'Karl Sasi',10,'',1,6,10,1875,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(1888,'Other','Open Gym',1747303200000,120,'Karl Sasi',10,'',1,6,10,1875,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(1889,'Other','Open Gym',1747908000000,120,'Karl Sasi',10,'',1,6,10,1875,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(1890,'Other','Open Gym',1748512800000,120,'Karl Sasi',10,'',1,6,10,1875,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(1891,'Other','Open Gym',1749117600000,120,'Karl Sasi',10,'',1,6,10,1875,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(1892,'Other','Open Gym',1749722400000,120,'Karl Sasi',10,'',1,6,10,1875,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(1893,'Other','Open Gym',1750327200000,120,'Karl Sasi',10,'',1,6,10,1875,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(1894,'Other','Open Gym',1750932000000,120,'Karl Sasi',10,'',1,6,10,1875,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(1895,'Other','Open Gym',1751536800000,120,'Karl Sasi',10,'',1,6,10,1875,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(1896,'Other','Open Gym',1752141600000,120,'Karl Sasi',10,'',1,6,10,1875,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(1897,'Other','Open Gym',1752746400000,120,'Karl Sasi',10,'',1,6,10,1875,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(1898,'Other','Open Gym',1753351200000,120,'Karl Sasi',10,'',1,6,10,1875,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(1899,'Other','Open Gym',1753956000000,120,'Karl Sasi',10,'',1,6,10,1875,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(1900,'Other','Open Gym',1754560800000,120,'Karl Sasi',10,'',1,6,10,1875,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(1901,'Other','Open Gym',1755165600000,120,'Karl Sasi',10,'',1,6,10,1875,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(1902,'Other','Open Gym',1755770400000,120,'Karl Sasi',10,'',1,6,10,1875,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(1903,'Other','Open Gym',1756375200000,120,'Karl Sasi',10,'',1,6,10,1875,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(1904,'Other','Open Gym',1756980000000,120,'Karl Sasi',10,'',1,6,10,1875,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(1905,'Other','Open Gym',1757584800000,120,'Karl Sasi',10,'',1,6,10,1875,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(1906,'Other','Open Gym',1758189600000,120,'Karl Sasi',10,'',1,6,10,1875,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(1907,'Other','Open Gym',1758794400000,120,'Karl Sasi',10,'',1,6,10,1875,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(1908,'Other','Open Gym',1759399200000,120,'Karl Sasi',10,'',1,6,10,1875,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(1909,'Other','Open Gym',1760004000000,120,'Karl Sasi',10,'',1,6,10,1875,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(1910,'Other','Open Gym',1760608800000,120,'Karl Sasi',10,'',1,6,10,1875,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(1911,'Other','Open Gym',1761213600000,120,'Karl Sasi',10,'',1,6,10,1875,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(1912,'Other','Open Gym',1761822000000,120,'Karl Sasi',10,'',1,6,10,1875,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(1913,'Other','Open Gym',1762426800000,120,'Karl Sasi',10,'',1,6,10,1875,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(1914,'Other','Open Gym',1763031600000,120,'Karl Sasi',10,'',1,6,10,1875,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(1915,'Other','Open Gym',1763636400000,120,'Karl Sasi',10,'',1,6,10,1875,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(1916,'Other','Open Gym',1764241200000,120,'Karl Sasi',10,'',1,6,10,1875,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(1917,'Other','Open Gym',1764846000000,120,'Karl Sasi',10,'',1,6,10,1875,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(1918,'Other','Open Gym',1765450800000,120,'Karl Sasi',10,'',1,6,10,1875,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(1919,'Other','Open Gym',1766055600000,120,'Karl Sasi',10,'',1,6,10,1875,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(1920,'Other','Open Gym',1766660400000,120,'Karl Sasi',10,'',1,6,10,1875,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(1921,'Other','Open Gym',1767265200000,120,'Karl Sasi',10,'',1,6,10,1875,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(1922,'Other','Open Gym',1767870000000,120,'Karl Sasi',10,'',1,6,10,1875,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(1923,'Other','Open Gym',1768474800000,120,'Karl Sasi',10,'',1,6,10,1875,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(1924,'Other','Open Gym',1769079600000,120,'Karl Sasi',10,'',1,6,10,1875,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(1925,'Other','Open Gym',1769684400000,120,'Karl Sasi',10,'',1,6,10,1875,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(1926,'Other','Open Gym',1770289200000,120,'Karl Sasi',10,'',1,6,10,1875,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(1927,'Other','Open Gym',1770894000000,120,'Karl Sasi',10,'',1,6,10,1875,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(1928,'Other','Open Gym',1739451600000,120,'Karl Sasi',10,'',1,6,10,NULL,'','For Time',NULL,1,0);
INSERT INTO ClassSchedule VALUES(1929,'Other','Open Gym',1740056400000,120,'Karl Sasi',10,'',1,6,10,1928,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(1930,'Other','Open Gym',1740661200000,120,'Karl Sasi',10,'',1,6,10,1928,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(1931,'Other','Open Gym',1741266000000,120,'Karl Sasi',10,'',1,6,10,1928,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(1932,'Other','Open Gym',1741870800000,120,'Karl Sasi',10,'',1,6,10,1928,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(1933,'Other','Open Gym',1742475600000,120,'Karl Sasi',10,'',1,6,10,1928,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(1934,'Other','Open Gym',1743080400000,120,'Karl Sasi',10,'',1,6,10,1928,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(1935,'Other','Open Gym',1743681600000,120,'Karl Sasi',10,'',1,6,10,1928,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(1936,'Other','Open Gym',1744286400000,120,'Karl Sasi',10,'',1,6,10,1928,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(1937,'Other','Open Gym',1744891200000,120,'Karl Sasi',10,'',1,6,10,1928,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(1938,'Other','Open Gym',1745496000000,120,'Karl Sasi',10,'',1,6,10,1928,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(1939,'Other','Open Gym',1746100800000,120,'Karl Sasi',10,'',1,6,10,1928,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(1940,'Other','Open Gym',1746705600000,120,'Karl Sasi',10,'',1,6,10,1928,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(1941,'Other','Open Gym',1747310400000,120,'Karl Sasi',10,'',1,6,10,1928,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(1942,'Other','Open Gym',1747915200000,120,'Karl Sasi',10,'',1,6,10,1928,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(1943,'Other','Open Gym',1748520000000,120,'Karl Sasi',10,'',1,6,10,1928,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(1944,'Other','Open Gym',1749124800000,120,'Karl Sasi',10,'',1,6,10,1928,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(1945,'Other','Open Gym',1749729600000,120,'Karl Sasi',10,'',1,6,10,1928,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(1946,'Other','Open Gym',1750334400000,120,'Karl Sasi',10,'',1,6,10,1928,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(1947,'Other','Open Gym',1750939200000,120,'Karl Sasi',10,'',1,6,10,1928,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(1948,'Other','Open Gym',1751544000000,120,'Karl Sasi',10,'',1,6,10,1928,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(1949,'Other','Open Gym',1752148800000,120,'Karl Sasi',10,'',1,6,10,1928,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(1950,'Other','Open Gym',1752753600000,120,'Karl Sasi',10,'',1,6,10,1928,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(1951,'Other','Open Gym',1753358400000,120,'Karl Sasi',10,'',1,6,10,1928,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(1952,'Other','Open Gym',1753963200000,120,'Karl Sasi',10,'',1,6,10,1928,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(1953,'Other','Open Gym',1754568000000,120,'Karl Sasi',10,'',1,6,10,1928,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(1954,'Other','Open Gym',1755172800000,120,'Karl Sasi',10,'',1,6,10,1928,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(1955,'Other','Open Gym',1755777600000,120,'Karl Sasi',10,'',1,6,10,1928,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(1956,'Other','Open Gym',1756382400000,120,'Karl Sasi',10,'',1,6,10,1928,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(1957,'Other','Open Gym',1756987200000,120,'Karl Sasi',10,'',1,6,10,1928,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(1958,'Other','Open Gym',1757592000000,120,'Karl Sasi',10,'',1,6,10,1928,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(1959,'Other','Open Gym',1758196800000,120,'Karl Sasi',10,'',1,6,10,1928,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(1960,'Other','Open Gym',1758801600000,120,'Karl Sasi',10,'',1,6,10,1928,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(1961,'Other','Open Gym',1759406400000,120,'Karl Sasi',10,'',1,6,10,1928,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(1962,'Other','Open Gym',1760011200000,120,'Karl Sasi',10,'',1,6,10,1928,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(1963,'Other','Open Gym',1760616000000,120,'Karl Sasi',10,'',1,6,10,1928,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(1964,'Other','Open Gym',1761220800000,120,'Karl Sasi',10,'',1,6,10,1928,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(1965,'Other','Open Gym',1761829200000,120,'Karl Sasi',10,'',1,6,10,1928,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(1966,'Other','Open Gym',1762434000000,120,'Karl Sasi',10,'',1,6,10,1928,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(1967,'Other','Open Gym',1763038800000,120,'Karl Sasi',10,'',1,6,10,1928,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(1968,'Other','Open Gym',1763643600000,120,'Karl Sasi',10,'',1,6,10,1928,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(1969,'Other','Open Gym',1764248400000,120,'Karl Sasi',10,'',1,6,10,1928,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(1970,'Other','Open Gym',1764853200000,120,'Karl Sasi',10,'',1,6,10,1928,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(1971,'Other','Open Gym',1765458000000,120,'Karl Sasi',10,'',1,6,10,1928,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(1972,'Other','Open Gym',1766062800000,120,'Karl Sasi',10,'',1,6,10,1928,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(1973,'Other','Open Gym',1766667600000,120,'Karl Sasi',10,'',1,6,10,1928,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(1974,'Other','Open Gym',1767272400000,120,'Karl Sasi',10,'',1,6,10,1928,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(1975,'Other','Open Gym',1767877200000,120,'Karl Sasi',10,'',1,6,10,1928,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(1976,'Other','Open Gym',1768482000000,120,'Karl Sasi',10,'',1,6,10,1928,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(1977,'Other','Open Gym',1769086800000,120,'Karl Sasi',10,'',1,6,10,1928,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(1978,'Other','Open Gym',1769691600000,120,'Karl Sasi',10,'',1,6,10,1928,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(1979,'Other','Open Gym',1770296400000,120,'Karl Sasi',10,'',1,6,10,1928,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(1980,'Other','Open Gym',1770901200000,120,'Karl Sasi',10,'',1,6,10,1928,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(1981,'Other','Open Gym',1739458800000,120,'Karl Sasi',10,'',1,6,10,NULL,'','For Time',NULL,1,0);
INSERT INTO ClassSchedule VALUES(1982,'Other','Open Gym',1740063600000,120,'Karl Sasi',10,'',1,6,10,1981,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(1983,'Other','Open Gym',1740668400000,120,'Karl Sasi',10,'',1,6,10,1981,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(1984,'Other','Open Gym',1741273200000,120,'Karl Sasi',10,'',1,6,10,1981,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(1985,'Other','Open Gym',1741878000000,120,'Karl Sasi',10,'',1,6,10,1981,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(1986,'Other','Open Gym',1742482800000,120,'Karl Sasi',10,'',1,6,10,1981,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(1987,'Other','Open Gym',1743087600000,120,'Karl Sasi',10,'',1,6,10,1981,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(1988,'Other','Open Gym',1743688800000,120,'Karl Sasi',10,'',1,6,10,1981,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(1989,'Other','Open Gym',1744293600000,120,'Karl Sasi',10,'',1,6,10,1981,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(1990,'Other','Open Gym',1744898400000,120,'Karl Sasi',10,'',1,6,10,1981,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(1991,'Other','Open Gym',1745503200000,120,'Karl Sasi',10,'',1,6,10,1981,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(1992,'Other','Open Gym',1746108000000,120,'Karl Sasi',10,'',1,6,10,1981,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(1993,'Other','Open Gym',1746712800000,120,'Karl Sasi',10,'',1,6,10,1981,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(1994,'Other','Open Gym',1747317600000,120,'Karl Sasi',10,'',1,6,10,1981,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(1995,'Other','Open Gym',1747922400000,120,'Karl Sasi',10,'',1,6,10,1981,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(1996,'Other','Open Gym',1748527200000,120,'Karl Sasi',10,'',1,6,10,1981,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(1997,'Other','Open Gym',1749132000000,120,'Karl Sasi',10,'',1,6,10,1981,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(1998,'Other','Open Gym',1749736800000,120,'Karl Sasi',10,'',1,6,10,1981,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(1999,'Other','Open Gym',1750341600000,120,'Karl Sasi',10,'',1,6,10,1981,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2000,'Other','Open Gym',1750946400000,120,'Karl Sasi',10,'',1,6,10,1981,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2001,'Other','Open Gym',1751551200000,120,'Karl Sasi',10,'',1,6,10,1981,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2002,'Other','Open Gym',1752156000000,120,'Karl Sasi',10,'',1,6,10,1981,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2003,'Other','Open Gym',1752760800000,120,'Karl Sasi',10,'',1,6,10,1981,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2004,'Other','Open Gym',1753365600000,120,'Karl Sasi',10,'',1,6,10,1981,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2005,'Other','Open Gym',1753970400000,120,'Karl Sasi',10,'',1,6,10,1981,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2006,'Other','Open Gym',1754575200000,120,'Karl Sasi',10,'',1,6,10,1981,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2007,'Other','Open Gym',1755180000000,120,'Karl Sasi',10,'',1,6,10,1981,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2008,'Other','Open Gym',1755784800000,120,'Karl Sasi',10,'',1,6,10,1981,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2009,'Other','Open Gym',1756389600000,120,'Karl Sasi',10,'',1,6,10,1981,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2010,'Other','Open Gym',1756994400000,120,'Karl Sasi',10,'',1,6,10,1981,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2011,'Other','Open Gym',1757599200000,120,'Karl Sasi',10,'',1,6,10,1981,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2012,'Other','Open Gym',1758204000000,120,'Karl Sasi',10,'',1,6,10,1981,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2013,'Other','Open Gym',1758808800000,120,'Karl Sasi',10,'',1,6,10,1981,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2014,'Other','Open Gym',1759413600000,120,'Karl Sasi',10,'',1,6,10,1981,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2015,'Other','Open Gym',1760018400000,120,'Karl Sasi',10,'',1,6,10,1981,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2016,'Other','Open Gym',1760623200000,120,'Karl Sasi',10,'',1,6,10,1981,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2017,'Other','Open Gym',1761228000000,120,'Karl Sasi',10,'',1,6,10,1981,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2018,'Other','Open Gym',1761836400000,120,'Karl Sasi',10,'',1,6,10,1981,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2019,'Other','Open Gym',1762441200000,120,'Karl Sasi',10,'',1,6,10,1981,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2020,'Other','Open Gym',1763046000000,120,'Karl Sasi',10,'',1,6,10,1981,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2021,'Other','Open Gym',1763650800000,120,'Karl Sasi',10,'',1,6,10,1981,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2022,'Other','Open Gym',1764255600000,120,'Karl Sasi',10,'',1,6,10,1981,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2023,'Other','Open Gym',1764860400000,120,'Karl Sasi',10,'',1,6,10,1981,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2024,'Other','Open Gym',1765465200000,120,'Karl Sasi',10,'',1,6,10,1981,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2025,'Other','Open Gym',1766070000000,120,'Karl Sasi',10,'',1,6,10,1981,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2026,'Other','Open Gym',1766674800000,120,'Karl Sasi',10,'',1,6,10,1981,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2027,'Other','Open Gym',1767279600000,120,'Karl Sasi',10,'',1,6,10,1981,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2028,'Other','Open Gym',1767884400000,120,'Karl Sasi',10,'',1,6,10,1981,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2029,'Other','Open Gym',1768489200000,120,'Karl Sasi',10,'',1,6,10,1981,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2030,'Other','Open Gym',1769094000000,120,'Karl Sasi',10,'',1,6,10,1981,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2031,'Other','Open Gym',1769698800000,120,'Karl Sasi',10,'',1,6,10,1981,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2032,'Other','Open Gym',1770303600000,120,'Karl Sasi',10,'',1,6,10,1981,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2033,'Other','Open Gym',1770908400000,120,'Karl Sasi',10,'',1,6,10,1981,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2034,'Weightlifting','Weightlifting',1739459700000,120,'Merit Mandel',10,'',1,6,10,NULL,'','For Time',NULL,1,0);
INSERT INTO ClassSchedule VALUES(2035,'Weightlifting','Weightlifting',1740064500000,120,'Merit Mandel',10,'',1,6,10,2034,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2036,'Weightlifting','Weightlifting',1740669300000,120,'Merit Mandel',10,'',1,6,10,2034,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2037,'Weightlifting','Weightlifting',1741274100000,120,'Merit Mandel',10,'',1,6,10,2034,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2038,'Weightlifting','Weightlifting',1741878900000,120,'Merit Mandel',10,'',1,6,10,2034,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2039,'Weightlifting','Weightlifting',1742483700000,120,'Merit Mandel',10,'',1,6,10,2034,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2040,'Weightlifting','Weightlifting',1743088500000,120,'Merit Mandel',10,'',1,6,10,2034,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2041,'Weightlifting','Weightlifting',1743689700000,120,'Merit Mandel',10,'',1,6,10,2034,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2042,'Weightlifting','Weightlifting',1744294500000,120,'Merit Mandel',10,'',1,6,10,2034,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2043,'Weightlifting','Weightlifting',1744899300000,120,'Merit Mandel',10,'',1,6,10,2034,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2044,'Weightlifting','Weightlifting',1745504100000,120,'Merit Mandel',10,'',1,6,10,2034,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2045,'Weightlifting','Weightlifting',1746108900000,120,'Merit Mandel',10,'',1,6,10,2034,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2046,'Weightlifting','Weightlifting',1746713700000,120,'Merit Mandel',10,'',1,6,10,2034,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2047,'Weightlifting','Weightlifting',1747318500000,120,'Merit Mandel',10,'',1,6,10,2034,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2048,'Weightlifting','Weightlifting',1747923300000,120,'Merit Mandel',10,'',1,6,10,2034,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2049,'Weightlifting','Weightlifting',1748528100000,120,'Merit Mandel',10,'',1,6,10,2034,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2050,'Weightlifting','Weightlifting',1749132900000,120,'Merit Mandel',10,'',1,6,10,2034,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2051,'Weightlifting','Weightlifting',1749737700000,120,'Merit Mandel',10,'',1,6,10,2034,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2052,'Weightlifting','Weightlifting',1750342500000,120,'Merit Mandel',10,'',1,6,10,2034,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2053,'Weightlifting','Weightlifting',1750947300000,120,'Merit Mandel',10,'',1,6,10,2034,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2054,'Weightlifting','Weightlifting',1751552100000,120,'Merit Mandel',10,'',1,6,10,2034,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2055,'Weightlifting','Weightlifting',1752156900000,120,'Merit Mandel',10,'',1,6,10,2034,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2056,'Weightlifting','Weightlifting',1752761700000,120,'Merit Mandel',10,'',1,6,10,2034,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2057,'Weightlifting','Weightlifting',1753366500000,120,'Merit Mandel',10,'',1,6,10,2034,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2058,'Weightlifting','Weightlifting',1753971300000,120,'Merit Mandel',10,'',1,6,10,2034,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2059,'Weightlifting','Weightlifting',1754576100000,120,'Merit Mandel',10,'',1,6,10,2034,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2060,'Weightlifting','Weightlifting',1755180900000,120,'Merit Mandel',10,'',1,6,10,2034,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2061,'Weightlifting','Weightlifting',1755785700000,120,'Merit Mandel',10,'',1,6,10,2034,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2062,'Weightlifting','Weightlifting',1756390500000,120,'Merit Mandel',10,'',1,6,10,2034,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2063,'Weightlifting','Weightlifting',1756995300000,120,'Merit Mandel',10,'',1,6,10,2034,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2064,'Weightlifting','Weightlifting',1757600100000,120,'Merit Mandel',10,'',1,6,10,2034,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2065,'Weightlifting','Weightlifting',1758204900000,120,'Merit Mandel',10,'',1,6,10,2034,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2066,'Weightlifting','Weightlifting',1758809700000,120,'Merit Mandel',10,'',1,6,10,2034,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2067,'Weightlifting','Weightlifting',1759414500000,120,'Merit Mandel',10,'',1,6,10,2034,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2068,'Weightlifting','Weightlifting',1760019300000,120,'Merit Mandel',10,'',1,6,10,2034,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2069,'Weightlifting','Weightlifting',1760624100000,120,'Merit Mandel',10,'',1,6,10,2034,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2070,'Weightlifting','Weightlifting',1761228900000,120,'Merit Mandel',10,'',1,6,10,2034,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2071,'Weightlifting','Weightlifting',1761837300000,120,'Merit Mandel',10,'',1,6,10,2034,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2072,'Weightlifting','Weightlifting',1762442100000,120,'Merit Mandel',10,'',1,6,10,2034,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2073,'Weightlifting','Weightlifting',1763046900000,120,'Merit Mandel',10,'',1,6,10,2034,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2074,'Weightlifting','Weightlifting',1763651700000,120,'Merit Mandel',10,'',1,6,10,2034,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2075,'Weightlifting','Weightlifting',1764256500000,120,'Merit Mandel',10,'',1,6,10,2034,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2076,'Weightlifting','Weightlifting',1764861300000,120,'Merit Mandel',10,'',1,6,10,2034,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2077,'Weightlifting','Weightlifting',1765466100000,120,'Merit Mandel',10,'',1,6,10,2034,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2078,'Weightlifting','Weightlifting',1766070900000,120,'Merit Mandel',10,'',1,6,10,2034,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2079,'Weightlifting','Weightlifting',1766675700000,120,'Merit Mandel',10,'',1,6,10,2034,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2080,'Weightlifting','Weightlifting',1767280500000,120,'Merit Mandel',10,'',1,6,10,2034,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2081,'Weightlifting','Weightlifting',1767885300000,120,'Merit Mandel',10,'',1,6,10,2034,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2082,'Weightlifting','Weightlifting',1768490100000,120,'Merit Mandel',10,'',1,6,10,2034,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2083,'Weightlifting','Weightlifting',1769094900000,120,'Merit Mandel',10,'',1,6,10,2034,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2084,'Weightlifting','Weightlifting',1769699700000,120,'Merit Mandel',10,'',1,6,10,2034,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2085,'Weightlifting','Weightlifting',1770304500000,120,'Merit Mandel',10,'',1,6,10,2034,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2086,'Weightlifting','Weightlifting',1770909300000,120,'Merit Mandel',10,'',1,6,10,2034,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2087,'Weightlifting','Weightlifting',1739465100000,120,'Merit Mandel',10,'',1,6,10,NULL,'','For Time',NULL,1,0);
INSERT INTO ClassSchedule VALUES(2088,'Weightlifting','Weightlifting',1740069900000,120,'Merit Mandel',10,'',1,6,10,2087,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2089,'Weightlifting','Weightlifting',1740674700000,120,'Merit Mandel',10,'',1,6,10,2087,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2090,'Weightlifting','Weightlifting',1741279500000,120,'Merit Mandel',10,'',1,6,10,2087,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2091,'Weightlifting','Weightlifting',1741884300000,120,'Merit Mandel',10,'',1,6,10,2087,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2092,'Weightlifting','Weightlifting',1742489100000,120,'Merit Mandel',10,'',1,6,10,2087,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2093,'Weightlifting','Weightlifting',1743093900000,120,'Merit Mandel',10,'',1,6,10,2087,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2094,'Weightlifting','Weightlifting',1743695100000,120,'Merit Mandel',10,'',1,6,10,2087,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2095,'Weightlifting','Weightlifting',1744299900000,120,'Merit Mandel',10,'',1,6,10,2087,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2096,'Weightlifting','Weightlifting',1744904700000,120,'Merit Mandel',10,'',1,6,10,2087,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2097,'Weightlifting','Weightlifting',1745509500000,120,'Merit Mandel',10,'',1,6,10,2087,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2098,'Weightlifting','Weightlifting',1746114300000,120,'Merit Mandel',10,'',1,6,10,2087,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2099,'Weightlifting','Weightlifting',1746719100000,120,'Merit Mandel',10,'',1,6,10,2087,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2100,'Weightlifting','Weightlifting',1747323900000,120,'Merit Mandel',10,'',1,6,10,2087,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2101,'Weightlifting','Weightlifting',1747928700000,120,'Merit Mandel',10,'',1,6,10,2087,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2102,'Weightlifting','Weightlifting',1748533500000,120,'Merit Mandel',10,'',1,6,10,2087,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2103,'Weightlifting','Weightlifting',1749138300000,120,'Merit Mandel',10,'',1,6,10,2087,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2104,'Weightlifting','Weightlifting',1749743100000,120,'Merit Mandel',10,'',1,6,10,2087,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2105,'Weightlifting','Weightlifting',1750347900000,120,'Merit Mandel',10,'',1,6,10,2087,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2106,'Weightlifting','Weightlifting',1750952700000,120,'Merit Mandel',10,'',1,6,10,2087,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2107,'Weightlifting','Weightlifting',1751557500000,120,'Merit Mandel',10,'',1,6,10,2087,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2108,'Weightlifting','Weightlifting',1752162300000,120,'Merit Mandel',10,'',1,6,10,2087,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2109,'Weightlifting','Weightlifting',1752767100000,120,'Merit Mandel',10,'',1,6,10,2087,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2110,'Weightlifting','Weightlifting',1753371900000,120,'Merit Mandel',10,'',1,6,10,2087,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2111,'Weightlifting','Weightlifting',1753976700000,120,'Merit Mandel',10,'',1,6,10,2087,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2112,'Weightlifting','Weightlifting',1754581500000,120,'Merit Mandel',10,'',1,6,10,2087,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2113,'Weightlifting','Weightlifting',1755186300000,120,'Merit Mandel',10,'',1,6,10,2087,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2114,'Weightlifting','Weightlifting',1755791100000,120,'Merit Mandel',10,'',1,6,10,2087,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2115,'Weightlifting','Weightlifting',1756395900000,120,'Merit Mandel',10,'',1,6,10,2087,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2116,'Weightlifting','Weightlifting',1757000700000,120,'Merit Mandel',10,'',1,6,10,2087,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2117,'Weightlifting','Weightlifting',1757605500000,120,'Merit Mandel',10,'',1,6,10,2087,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2118,'Weightlifting','Weightlifting',1758210300000,120,'Merit Mandel',10,'',1,6,10,2087,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2119,'Weightlifting','Weightlifting',1758815100000,120,'Merit Mandel',10,'',1,6,10,2087,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2120,'Weightlifting','Weightlifting',1759419900000,120,'Merit Mandel',10,'',1,6,10,2087,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2121,'Weightlifting','Weightlifting',1760024700000,120,'Merit Mandel',10,'',1,6,10,2087,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2122,'Weightlifting','Weightlifting',1760629500000,120,'Merit Mandel',10,'',1,6,10,2087,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2123,'Weightlifting','Weightlifting',1761234300000,120,'Merit Mandel',10,'',1,6,10,2087,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2124,'Weightlifting','Weightlifting',1761842700000,120,'Merit Mandel',10,'',1,6,10,2087,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2125,'Weightlifting','Weightlifting',1762447500000,120,'Merit Mandel',10,'',1,6,10,2087,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2126,'Weightlifting','Weightlifting',1763052300000,120,'Merit Mandel',10,'',1,6,10,2087,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2127,'Weightlifting','Weightlifting',1763657100000,120,'Merit Mandel',10,'',1,6,10,2087,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2128,'Weightlifting','Weightlifting',1764261900000,120,'Merit Mandel',10,'',1,6,10,2087,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2129,'Weightlifting','Weightlifting',1764866700000,120,'Merit Mandel',10,'',1,6,10,2087,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2130,'Weightlifting','Weightlifting',1765471500000,120,'Merit Mandel',10,'',1,6,10,2087,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2131,'Weightlifting','Weightlifting',1766076300000,120,'Merit Mandel',10,'',1,6,10,2087,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2132,'Weightlifting','Weightlifting',1766681100000,120,'Merit Mandel',10,'',1,6,10,2087,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2133,'Weightlifting','Weightlifting',1767285900000,120,'Merit Mandel',10,'',1,6,10,2087,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2134,'Weightlifting','Weightlifting',1767890700000,120,'Merit Mandel',10,'',1,6,10,2087,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2135,'Weightlifting','Weightlifting',1768495500000,120,'Merit Mandel',10,'',1,6,10,2087,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2136,'Weightlifting','Weightlifting',1769100300000,120,'Merit Mandel',10,'',1,6,10,2087,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2137,'Weightlifting','Weightlifting',1769705100000,120,'Merit Mandel',10,'',1,6,10,2087,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2138,'Weightlifting','Weightlifting',1770309900000,120,'Merit Mandel',10,'',1,6,10,2087,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2139,'Weightlifting','Weightlifting',1770914700000,120,'Merit Mandel',10,'',1,6,10,2087,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2140,'Cardio','asdasd',1739350020000,123,'',12,'',1,6,10,NULL,'','For Time',NULL,1,0);
INSERT INTO ClassSchedule VALUES(2141,'Cardio','asdasd',1739954820000,123,'',12,'',1,6,10,2140,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2143,'Cardio','asdasd',1741164420000,123,'',12,'',1,6,10,2140,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2144,'Cardio','asdasd',1741769220000,123,'',12,'',1,6,10,2140,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2145,'Cardio','asdasd',1742374020000,123,'',12,'',1,6,10,2140,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2146,'Cardio','asdasd',1742978820000,123,'',12,'',1,6,10,2140,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2147,'Cardio','asdasd',1743580020000,123,'',12,'',1,6,10,2140,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2148,'Cardio','asdasd',1744184820000,123,'',12,'',1,6,10,2140,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2149,'Cardio','asdasd',1744789620000,123,'',12,'',1,6,10,2140,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2150,'Cardio','asdasd',1745394420000,123,'',12,'',1,6,10,2140,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2151,'Cardio','asdasd',1745999220000,123,'',12,'',1,6,10,2140,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2152,'Cardio','asdasd',1746604020000,123,'',12,'',1,6,10,2140,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2153,'Cardio','asdasd',1747208820000,123,'',12,'',1,6,10,2140,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2154,'Cardio','asdasd',1747813620000,123,'',12,'',1,6,10,2140,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2155,'Cardio','asdasd',1748418420000,123,'',12,'',1,6,10,2140,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2156,'Cardio','asdasd',1749023220000,123,'',12,'',1,6,10,2140,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2157,'Cardio','asdasd',1749628020000,123,'',12,'',1,6,10,2140,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2158,'Cardio','asdasd',1750232820000,123,'',12,'',1,6,10,2140,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2159,'Cardio','asdasd',1750837620000,123,'',12,'',1,6,10,2140,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2160,'Cardio','asdasd',1751442420000,123,'',12,'',1,6,10,2140,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2161,'Cardio','asdasd',1752047220000,123,'',12,'',1,6,10,2140,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2162,'Cardio','asdasd',1752652020000,123,'',12,'',1,6,10,2140,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2163,'Cardio','asdasd',1753256820000,123,'',12,'',1,6,10,2140,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2164,'Cardio','asdasd',1753861620000,123,'',12,'',1,6,10,2140,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2165,'Cardio','asdasd',1754466420000,123,'',12,'',1,6,10,2140,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2166,'Cardio','asdasd',1755071220000,123,'',12,'',1,6,10,2140,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2167,'Cardio','asdasd',1755676020000,123,'',12,'',1,6,10,2140,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2168,'Cardio','asdasd',1756280820000,123,'',12,'',1,6,10,2140,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2169,'Cardio','asdasd',1756885620000,123,'',12,'',1,6,10,2140,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2170,'Cardio','asdasd',1757490420000,123,'',12,'',1,6,10,2140,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2171,'Cardio','asdasd',1758095220000,123,'',12,'',1,6,10,2140,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2172,'Cardio','asdasd',1758700020000,123,'',12,'',1,6,10,2140,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2173,'Cardio','asdasd',1759304820000,123,'',12,'',1,6,10,2140,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2174,'Cardio','asdasd',1759909620000,123,'',12,'',1,6,10,2140,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2175,'Cardio','asdasd',1760514420000,123,'',12,'',1,6,10,2140,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2176,'Cardio','asdasd',1761119220000,123,'',12,'',1,6,10,2140,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2177,'Cardio','asdasd',1761727620000,123,'',12,'',1,6,10,2140,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2178,'Cardio','asdasd',1762332420000,123,'',12,'',1,6,10,2140,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2179,'Cardio','asdasd',1762937220000,123,'',12,'',1,6,10,2140,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2180,'Cardio','asdasd',1763542020000,123,'',12,'',1,6,10,2140,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2181,'Cardio','asdasd',1764146820000,123,'',12,'',1,6,10,2140,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2182,'Cardio','asdasd',1764751620000,123,'',12,'',1,6,10,2140,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2183,'Cardio','asdasd',1765356420000,123,'',12,'',1,6,10,2140,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2184,'Cardio','asdasd',1765961220000,123,'',12,'',1,6,10,2140,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2185,'Cardio','asdasd',1766566020000,123,'',12,'',1,6,10,2140,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2186,'Cardio','asdasd',1767170820000,123,'',12,'',1,6,10,2140,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2187,'Cardio','asdasd',1767775620000,123,'',12,'',1,6,10,2140,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2188,'Cardio','asdasd',1768380420000,123,'',12,'',1,6,10,2140,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2189,'Cardio','asdasd',1768985220000,123,'',12,'',1,6,10,2140,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2190,'Cardio','asdasd',1769590020000,123,'',12,'',1,6,10,2140,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2191,'Cardio','asdasd',1770194820000,123,'',12,'',1,6,10,2140,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2192,'Cardio','asdasd',1770799620000,123,'',12,'',1,6,10,2140,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2193,'WOD','CROSSFIT',1739786400000,60,'Karl Sasi',14,'Must saal',1,6,10,NULL,'','For Time',replace('\n2,000-m row','\n',char(10)),1,0);
INSERT INTO ClassSchedule VALUES(2194,'WOD','CROSSFIT',1740391200000,60,'Karl Sasi',14,'Must saal',1,6,10,2193,NULL,NULL,'bmu',1,0);
INSERT INTO ClassSchedule VALUES(2195,'WOD','CROSSFIT',1740996000000,60,'Karl Sasi',14,'Must saal',1,6,10,2193,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2196,'WOD','CROSSFIT',1741600800000,60,'Karl Sasi',14,'Must saal',1,6,10,2193,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2197,'WOD','CROSSFIT',1742205600000,60,'Karl Sasi',14,'Must saal',1,6,10,2193,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2198,'WOD','CROSSFIT',1742810400000,60,'Karl Sasi',14,'Must saal',1,6,10,2193,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2199,'WOD','CROSSFIT',1743411600000,60,'Karl Sasi',14,'Must saal',1,6,10,2193,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2200,'WOD','CROSSFIT',1744016400000,60,'Karl Sasi',14,'Must saal',1,6,10,2193,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2201,'WOD','CROSSFIT',1744621200000,60,'Karl Sasi',14,'Must saal',1,6,10,2193,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2202,'WOD','CROSSFIT',1745226000000,60,'Karl Sasi',14,'Must saal',1,6,10,2193,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2203,'WOD','CROSSFIT',1745830800000,60,'Karl Sasi',14,'Must saal',1,6,10,2193,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2204,'WOD','CROSSFIT',1746435600000,60,'Karl Sasi',14,'Must saal',1,6,10,2193,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2205,'WOD','CROSSFIT',1747040400000,60,'Karl Sasi',14,'Must saal',1,6,10,2193,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2206,'WOD','CROSSFIT',1747645200000,60,'Karl Sasi',14,'Must saal',1,6,10,2193,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2207,'WOD','CROSSFIT',1748250000000,60,'Karl Sasi',14,'Must saal',1,6,10,2193,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2208,'WOD','CROSSFIT',1748854800000,60,'Karl Sasi',14,'Must saal',1,6,10,2193,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2209,'WOD','CROSSFIT',1749459600000,60,'Karl Sasi',14,'Must saal',1,6,10,2193,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2210,'WOD','CROSSFIT',1750064400000,60,'Karl Sasi',14,'Must saal',1,6,10,2193,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2211,'WOD','CROSSFIT',1750669200000,60,'Karl Sasi',14,'Must saal',1,6,10,2193,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2212,'WOD','CROSSFIT',1751274000000,60,'Karl Sasi',14,'Must saal',1,6,10,2193,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2213,'WOD','CROSSFIT',1751878800000,60,'Karl Sasi',14,'Must saal',1,6,10,2193,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2214,'WOD','CROSSFIT',1752483600000,60,'Karl Sasi',14,'Must saal',1,6,10,2193,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2215,'WOD','CROSSFIT',1753088400000,60,'Karl Sasi',14,'Must saal',1,6,10,2193,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2216,'WOD','CROSSFIT',1753693200000,60,'Karl Sasi',14,'Must saal',1,6,10,2193,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2217,'WOD','CROSSFIT',1754298000000,60,'Karl Sasi',14,'Must saal',1,6,10,2193,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2218,'WOD','CROSSFIT',1754902800000,60,'Karl Sasi',14,'Must saal',1,6,10,2193,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2219,'WOD','CROSSFIT',1755507600000,60,'Karl Sasi',14,'Must saal',1,6,10,2193,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2220,'WOD','CROSSFIT',1756112400000,60,'Karl Sasi',14,'Must saal',1,6,10,2193,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2221,'WOD','CROSSFIT',1756717200000,60,'Karl Sasi',14,'Must saal',1,6,10,2193,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2222,'WOD','CROSSFIT',1757322000000,60,'Karl Sasi',14,'Must saal',1,6,10,2193,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2223,'WOD','CROSSFIT',1757926800000,60,'Karl Sasi',14,'Must saal',1,6,10,2193,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2224,'WOD','CROSSFIT',1758531600000,60,'Karl Sasi',14,'Must saal',1,6,10,2193,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2225,'WOD','CROSSFIT',1759136400000,60,'Karl Sasi',14,'Must saal',1,6,10,2193,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2226,'WOD','CROSSFIT',1759741200000,60,'Karl Sasi',14,'Must saal',1,6,10,2193,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2227,'WOD','CROSSFIT',1760346000000,60,'Karl Sasi',14,'Must saal',1,6,10,2193,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2228,'WOD','CROSSFIT',1760950800000,60,'Karl Sasi',14,'Must saal',1,6,10,2193,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2229,'WOD','CROSSFIT',1761559200000,60,'Karl Sasi',14,'Must saal',1,6,10,2193,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2230,'WOD','CROSSFIT',1762164000000,60,'Karl Sasi',14,'Must saal',1,6,10,2193,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2231,'WOD','CROSSFIT',1762768800000,60,'Karl Sasi',14,'Must saal',1,6,10,2193,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2232,'WOD','CROSSFIT',1763373600000,60,'Karl Sasi',14,'Must saal',1,6,10,2193,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2233,'WOD','CROSSFIT',1763978400000,60,'Karl Sasi',14,'Must saal',1,6,10,2193,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2234,'WOD','CROSSFIT',1764583200000,60,'Karl Sasi',14,'Must saal',1,6,10,2193,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2235,'WOD','CROSSFIT',1765188000000,60,'Karl Sasi',14,'Must saal',1,6,10,2193,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2236,'WOD','CROSSFIT',1765792800000,60,'Karl Sasi',14,'Must saal',1,6,10,2193,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2237,'WOD','CROSSFIT',1766397600000,60,'Karl Sasi',14,'Must saal',1,6,10,2193,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2238,'WOD','CROSSFIT',1767002400000,60,'Karl Sasi',14,'Must saal',1,6,10,2193,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2239,'WOD','CROSSFIT',1767607200000,60,'Karl Sasi',14,'Must saal',1,6,10,2193,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2240,'WOD','CROSSFIT',1768212000000,60,'Karl Sasi',14,'Must saal',1,6,10,2193,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2241,'WOD','CROSSFIT',1768816800000,60,'Karl Sasi',14,'Must saal',1,6,10,2193,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2242,'WOD','CROSSFIT',1769421600000,60,'Karl Sasi',14,'Must saal',1,6,10,2193,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2243,'WOD','CROSSFIT',1770026400000,60,'Karl Sasi',14,'Must saal',1,6,10,2193,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2244,'WOD','CROSSFIT',1770631200000,60,'Karl Sasi',14,'Must saal',1,6,10,2193,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2245,'WOD','CROSSFIT',1771236000000,60,'Karl Sasi',14,'Must saal',1,6,10,2193,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2246,'WOD','CROSSFIT',1739802600000,60,'Tarvi Torn',14,'Must saal',1,6,10,NULL,'','For Time',replace('\n2,000-m row','\n',char(10)),1,0);
INSERT INTO ClassSchedule VALUES(2247,'WOD','CROSSFIT',1740407400000,60,'Tarvi Torn',14,'Must saal',1,6,10,2246,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2248,'WOD','CROSSFIT',1741012200000,60,'Tarvi Torn',14,'Must saal',1,6,10,2246,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2249,'WOD','CROSSFIT',1741617000000,60,'Tarvi Torn',14,'Must saal',1,6,10,2246,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2250,'WOD','CROSSFIT',1742221800000,60,'Tarvi Torn',14,'Must saal',1,6,10,2246,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2251,'WOD','CROSSFIT',1742826600000,60,'Tarvi Torn',14,'Must saal',1,6,10,2246,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2252,'WOD','CROSSFIT',1743427800000,60,'Tarvi Torn',14,'Must saal',1,6,10,2246,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2253,'WOD','CROSSFIT',1744032600000,60,'Tarvi Torn',14,'Must saal',1,6,10,2246,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2254,'WOD','CROSSFIT',1744637400000,60,'Tarvi Torn',14,'Must saal',1,6,10,2246,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2255,'WOD','CROSSFIT',1745242200000,60,'Tarvi Torn',14,'Must saal',1,6,10,2246,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2256,'WOD','CROSSFIT',1745847000000,60,'Tarvi Torn',14,'Must saal',1,6,10,2246,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2257,'WOD','CROSSFIT',1746451800000,60,'Tarvi Torn',14,'Must saal',1,6,10,2246,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2258,'WOD','CROSSFIT',1747056600000,60,'Tarvi Torn',14,'Must saal',1,6,10,2246,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2259,'WOD','CROSSFIT',1747661400000,60,'Tarvi Torn',14,'Must saal',1,6,10,2246,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2260,'WOD','CROSSFIT',1748266200000,60,'Tarvi Torn',14,'Must saal',1,6,10,2246,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2261,'WOD','CROSSFIT',1748871000000,60,'Tarvi Torn',14,'Must saal',1,6,10,2246,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2262,'WOD','CROSSFIT',1749475800000,60,'Tarvi Torn',14,'Must saal',1,6,10,2246,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2263,'WOD','CROSSFIT',1750080600000,60,'Tarvi Torn',14,'Must saal',1,6,10,2246,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2264,'WOD','CROSSFIT',1750685400000,60,'Tarvi Torn',14,'Must saal',1,6,10,2246,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2265,'WOD','CROSSFIT',1751290200000,60,'Tarvi Torn',14,'Must saal',1,6,10,2246,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2266,'WOD','CROSSFIT',1751895000000,60,'Tarvi Torn',14,'Must saal',1,6,10,2246,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2267,'WOD','CROSSFIT',1752499800000,60,'Tarvi Torn',14,'Must saal',1,6,10,2246,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2268,'WOD','CROSSFIT',1753104600000,60,'Tarvi Torn',14,'Must saal',1,6,10,2246,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2269,'WOD','CROSSFIT',1753709400000,60,'Tarvi Torn',14,'Must saal',1,6,10,2246,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2270,'WOD','CROSSFIT',1754314200000,60,'Tarvi Torn',14,'Must saal',1,6,10,2246,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2271,'WOD','CROSSFIT',1754919000000,60,'Tarvi Torn',14,'Must saal',1,6,10,2246,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2272,'WOD','CROSSFIT',1755523800000,60,'Tarvi Torn',14,'Must saal',1,6,10,2246,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2273,'WOD','CROSSFIT',1756128600000,60,'Tarvi Torn',14,'Must saal',1,6,10,2246,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2274,'WOD','CROSSFIT',1756733400000,60,'Tarvi Torn',14,'Must saal',1,6,10,2246,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2275,'WOD','CROSSFIT',1757338200000,60,'Tarvi Torn',14,'Must saal',1,6,10,2246,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2276,'WOD','CROSSFIT',1757943000000,60,'Tarvi Torn',14,'Must saal',1,6,10,2246,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2277,'WOD','CROSSFIT',1758547800000,60,'Tarvi Torn',14,'Must saal',1,6,10,2246,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2278,'WOD','CROSSFIT',1759152600000,60,'Tarvi Torn',14,'Must saal',1,6,10,2246,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2279,'WOD','CROSSFIT',1759757400000,60,'Tarvi Torn',14,'Must saal',1,6,10,2246,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2280,'WOD','CROSSFIT',1760362200000,60,'Tarvi Torn',14,'Must saal',1,6,10,2246,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2281,'WOD','CROSSFIT',1760967000000,60,'Tarvi Torn',14,'Must saal',1,6,10,2246,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2282,'WOD','CROSSFIT',1761575400000,60,'Tarvi Torn',14,'Must saal',1,6,10,2246,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2283,'WOD','CROSSFIT',1762180200000,60,'Tarvi Torn',14,'Must saal',1,6,10,2246,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2284,'WOD','CROSSFIT',1762785000000,60,'Tarvi Torn',14,'Must saal',1,6,10,2246,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2285,'WOD','CROSSFIT',1763389800000,60,'Tarvi Torn',14,'Must saal',1,6,10,2246,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2286,'WOD','CROSSFIT',1763994600000,60,'Tarvi Torn',14,'Must saal',1,6,10,2246,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2287,'WOD','CROSSFIT',1764599400000,60,'Tarvi Torn',14,'Must saal',1,6,10,2246,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2288,'WOD','CROSSFIT',1765204200000,60,'Tarvi Torn',14,'Must saal',1,6,10,2246,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2289,'WOD','CROSSFIT',1765809000000,60,'Tarvi Torn',14,'Must saal',1,6,10,2246,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2290,'WOD','CROSSFIT',1766413800000,60,'Tarvi Torn',14,'Must saal',1,6,10,2246,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2291,'WOD','CROSSFIT',1767018600000,60,'Tarvi Torn',14,'Must saal',1,6,10,2246,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2292,'WOD','CROSSFIT',1767623400000,60,'Tarvi Torn',14,'Must saal',1,6,10,2246,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2293,'WOD','CROSSFIT',1768228200000,60,'Tarvi Torn',14,'Must saal',1,6,10,2246,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2294,'WOD','CROSSFIT',1768833000000,60,'Tarvi Torn',14,'Must saal',1,6,10,2246,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2295,'WOD','CROSSFIT',1769437800000,60,'Tarvi Torn',14,'Must saal',1,6,10,2246,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2296,'WOD','CROSSFIT',1770042600000,60,'Tarvi Torn',14,'Must saal',1,6,10,2246,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2297,'WOD','CROSSFIT',1770647400000,60,'Tarvi Torn',14,'Must saal',1,6,10,2246,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2298,'WOD','CROSSFIT',1771252200000,60,'Tarvi Torn',14,'Must saal',1,6,10,2246,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2299,'WOD','CROSSFIT',1739806200000,60,'Tarvi Torn',14,'Must saal',1,6,10,NULL,'','For Time',replace('\n2,000-m row','\n',char(10)),1,0);
INSERT INTO ClassSchedule VALUES(2300,'WOD','CROSSFIT',1740411000000,60,'Tarvi Torn',14,'Must saal',1,6,10,2299,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2301,'WOD','CROSSFIT',1741015800000,60,'Tarvi Torn',14,'Must saal',1,6,10,2299,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2302,'WOD','CROSSFIT',1741620600000,60,'Tarvi Torn',14,'Must saal',1,6,10,2299,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2303,'WOD','CROSSFIT',1742225400000,60,'Tarvi Torn',14,'Must saal',1,6,10,2299,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2304,'WOD','CROSSFIT',1742830200000,60,'Tarvi Torn',14,'Must saal',1,6,10,2299,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2305,'WOD','CROSSFIT',1743431400000,60,'Tarvi Torn',14,'Must saal',1,6,10,2299,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2306,'WOD','CROSSFIT',1744036200000,60,'Tarvi Torn',14,'Must saal',1,6,10,2299,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2307,'WOD','CROSSFIT',1744641000000,60,'Tarvi Torn',14,'Must saal',1,6,10,2299,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2308,'WOD','CROSSFIT',1745245800000,60,'Tarvi Torn',14,'Must saal',1,6,10,2299,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2309,'WOD','CROSSFIT',1745850600000,60,'Tarvi Torn',14,'Must saal',1,6,10,2299,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2310,'WOD','CROSSFIT',1746455400000,60,'Tarvi Torn',14,'Must saal',1,6,10,2299,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2311,'WOD','CROSSFIT',1747060200000,60,'Tarvi Torn',14,'Must saal',1,6,10,2299,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2312,'WOD','CROSSFIT',1747665000000,60,'Tarvi Torn',14,'Must saal',1,6,10,2299,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2313,'WOD','CROSSFIT',1748269800000,60,'Tarvi Torn',14,'Must saal',1,6,10,2299,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2314,'WOD','CROSSFIT',1748874600000,60,'Tarvi Torn',14,'Must saal',1,6,10,2299,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2315,'WOD','CROSSFIT',1749479400000,60,'Tarvi Torn',14,'Must saal',1,6,10,2299,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2316,'WOD','CROSSFIT',1750084200000,60,'Tarvi Torn',14,'Must saal',1,6,10,2299,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2317,'WOD','CROSSFIT',1750689000000,60,'Tarvi Torn',14,'Must saal',1,6,10,2299,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2318,'WOD','CROSSFIT',1751293800000,60,'Tarvi Torn',14,'Must saal',1,6,10,2299,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2319,'WOD','CROSSFIT',1751898600000,60,'Tarvi Torn',14,'Must saal',1,6,10,2299,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2320,'WOD','CROSSFIT',1752503400000,60,'Tarvi Torn',14,'Must saal',1,6,10,2299,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2321,'WOD','CROSSFIT',1753108200000,60,'Tarvi Torn',14,'Must saal',1,6,10,2299,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2322,'WOD','CROSSFIT',1753713000000,60,'Tarvi Torn',14,'Must saal',1,6,10,2299,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2323,'WOD','CROSSFIT',1754317800000,60,'Tarvi Torn',14,'Must saal',1,6,10,2299,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2324,'WOD','CROSSFIT',1754922600000,60,'Tarvi Torn',14,'Must saal',1,6,10,2299,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2325,'WOD','CROSSFIT',1755527400000,60,'Tarvi Torn',14,'Must saal',1,6,10,2299,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2326,'WOD','CROSSFIT',1756132200000,60,'Tarvi Torn',14,'Must saal',1,6,10,2299,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2327,'WOD','CROSSFIT',1756737000000,60,'Tarvi Torn',14,'Must saal',1,6,10,2299,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2328,'WOD','CROSSFIT',1757341800000,60,'Tarvi Torn',14,'Must saal',1,6,10,2299,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2329,'WOD','CROSSFIT',1757946600000,60,'Tarvi Torn',14,'Must saal',1,6,10,2299,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2330,'WOD','CROSSFIT',1758551400000,60,'Tarvi Torn',14,'Must saal',1,6,10,2299,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2331,'WOD','CROSSFIT',1759156200000,60,'Tarvi Torn',14,'Must saal',1,6,10,2299,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2332,'WOD','CROSSFIT',1759761000000,60,'Tarvi Torn',14,'Must saal',1,6,10,2299,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2333,'WOD','CROSSFIT',1760365800000,60,'Tarvi Torn',14,'Must saal',1,6,10,2299,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2334,'WOD','CROSSFIT',1760970600000,60,'Tarvi Torn',14,'Must saal',1,6,10,2299,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2335,'WOD','CROSSFIT',1761579000000,60,'Tarvi Torn',14,'Must saal',1,6,10,2299,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2336,'WOD','CROSSFIT',1762183800000,60,'Tarvi Torn',14,'Must saal',1,6,10,2299,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2337,'WOD','CROSSFIT',1762788600000,60,'Tarvi Torn',14,'Must saal',1,6,10,2299,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2338,'WOD','CROSSFIT',1763393400000,60,'Tarvi Torn',14,'Must saal',1,6,10,2299,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2339,'WOD','CROSSFIT',1763998200000,60,'Tarvi Torn',14,'Must saal',1,6,10,2299,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2340,'WOD','CROSSFIT',1764603000000,60,'Tarvi Torn',14,'Must saal',1,6,10,2299,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2341,'WOD','CROSSFIT',1765207800000,60,'Tarvi Torn',14,'Must saal',1,6,10,2299,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2342,'WOD','CROSSFIT',1765812600000,60,'Tarvi Torn',14,'Must saal',1,6,10,2299,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2343,'WOD','CROSSFIT',1766417400000,60,'Tarvi Torn',14,'Must saal',1,6,10,2299,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2344,'WOD','CROSSFIT',1767022200000,60,'Tarvi Torn',14,'Must saal',1,6,10,2299,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2345,'WOD','CROSSFIT',1767627000000,60,'Tarvi Torn',14,'Must saal',1,6,10,2299,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2346,'WOD','CROSSFIT',1768231800000,60,'Tarvi Torn',14,'Must saal',1,6,10,2299,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2347,'WOD','CROSSFIT',1768836600000,60,'Tarvi Torn',14,'Must saal',1,6,10,2299,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2348,'WOD','CROSSFIT',1769441400000,60,'Tarvi Torn',14,'Must saal',1,6,10,2299,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2349,'WOD','CROSSFIT',1770046200000,60,'Tarvi Torn',14,'Must saal',1,6,10,2299,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2350,'WOD','CROSSFIT',1770651000000,60,'Tarvi Torn',14,'Must saal',1,6,10,2299,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2351,'WOD','CROSSFIT',1771255800000,60,'Tarvi Torn',14,'Must saal',1,6,10,2299,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2352,'WOD','CROSSFIT',1739809800000,60,'Tarvi Torn',14,'Must saal',1,6,10,NULL,'','For Time',replace('\n2,000-m row','\n',char(10)),1,0);
INSERT INTO ClassSchedule VALUES(2353,'WOD','CROSSFIT',1740414600000,60,'Tarvi Torn',14,'Must saal',1,6,10,2352,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2354,'WOD','CROSSFIT',1741019400000,60,'Tarvi Torn',14,'Must saal',1,6,10,2352,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2355,'WOD','CROSSFIT',1741624200000,60,'Tarvi Torn',14,'Must saal',1,6,10,2352,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2356,'WOD','CROSSFIT',1742229000000,60,'Tarvi Torn',14,'Must saal',1,6,10,2352,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2357,'WOD','CROSSFIT',1742833800000,60,'Tarvi Torn',14,'Must saal',1,6,10,2352,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2358,'WOD','CROSSFIT',1743435000000,60,'Tarvi Torn',14,'Must saal',1,6,10,2352,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2359,'WOD','CROSSFIT',1744039800000,60,'Tarvi Torn',14,'Must saal',1,6,10,2352,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2360,'WOD','CROSSFIT',1744644600000,60,'Tarvi Torn',14,'Must saal',1,6,10,2352,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2361,'WOD','CROSSFIT',1745249400000,60,'Tarvi Torn',14,'Must saal',1,6,10,2352,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2362,'WOD','CROSSFIT',1745854200000,60,'Tarvi Torn',14,'Must saal',1,6,10,2352,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2363,'WOD','CROSSFIT',1746459000000,60,'Tarvi Torn',14,'Must saal',1,6,10,2352,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2364,'WOD','CROSSFIT',1747063800000,60,'Tarvi Torn',14,'Must saal',1,6,10,2352,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2365,'WOD','CROSSFIT',1747668600000,60,'Tarvi Torn',14,'Must saal',1,6,10,2352,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2366,'WOD','CROSSFIT',1748273400000,60,'Tarvi Torn',14,'Must saal',1,6,10,2352,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2367,'WOD','CROSSFIT',1748878200000,60,'Tarvi Torn',14,'Must saal',1,6,10,2352,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2368,'WOD','CROSSFIT',1749483000000,60,'Tarvi Torn',14,'Must saal',1,6,10,2352,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2369,'WOD','CROSSFIT',1750087800000,60,'Tarvi Torn',14,'Must saal',1,6,10,2352,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2370,'WOD','CROSSFIT',1750692600000,60,'Tarvi Torn',14,'Must saal',1,6,10,2352,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2371,'WOD','CROSSFIT',1751297400000,60,'Tarvi Torn',14,'Must saal',1,6,10,2352,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2372,'WOD','CROSSFIT',1751902200000,60,'Tarvi Torn',14,'Must saal',1,6,10,2352,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2373,'WOD','CROSSFIT',1752507000000,60,'Tarvi Torn',14,'Must saal',1,6,10,2352,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2374,'WOD','CROSSFIT',1753111800000,60,'Tarvi Torn',14,'Must saal',1,6,10,2352,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2375,'WOD','CROSSFIT',1753716600000,60,'Tarvi Torn',14,'Must saal',1,6,10,2352,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2376,'WOD','CROSSFIT',1754321400000,60,'Tarvi Torn',14,'Must saal',1,6,10,2352,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2377,'WOD','CROSSFIT',1754926200000,60,'Tarvi Torn',14,'Must saal',1,6,10,2352,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2378,'WOD','CROSSFIT',1755531000000,60,'Tarvi Torn',14,'Must saal',1,6,10,2352,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2379,'WOD','CROSSFIT',1756135800000,60,'Tarvi Torn',14,'Must saal',1,6,10,2352,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2380,'WOD','CROSSFIT',1756740600000,60,'Tarvi Torn',14,'Must saal',1,6,10,2352,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2381,'WOD','CROSSFIT',1757345400000,60,'Tarvi Torn',14,'Must saal',1,6,10,2352,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2382,'WOD','CROSSFIT',1757950200000,60,'Tarvi Torn',14,'Must saal',1,6,10,2352,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2383,'WOD','CROSSFIT',1758555000000,60,'Tarvi Torn',14,'Must saal',1,6,10,2352,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2384,'WOD','CROSSFIT',1759159800000,60,'Tarvi Torn',14,'Must saal',1,6,10,2352,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2385,'WOD','CROSSFIT',1759764600000,60,'Tarvi Torn',14,'Must saal',1,6,10,2352,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2386,'WOD','CROSSFIT',1760369400000,60,'Tarvi Torn',14,'Must saal',1,6,10,2352,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2387,'WOD','CROSSFIT',1760974200000,60,'Tarvi Torn',14,'Must saal',1,6,10,2352,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2388,'WOD','CROSSFIT',1761582600000,60,'Tarvi Torn',14,'Must saal',1,6,10,2352,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2389,'WOD','CROSSFIT',1762187400000,60,'Tarvi Torn',14,'Must saal',1,6,10,2352,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2390,'WOD','CROSSFIT',1762792200000,60,'Tarvi Torn',14,'Must saal',1,6,10,2352,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2391,'WOD','CROSSFIT',1763397000000,60,'Tarvi Torn',14,'Must saal',1,6,10,2352,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2392,'WOD','CROSSFIT',1764001800000,60,'Tarvi Torn',14,'Must saal',1,6,10,2352,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2393,'WOD','CROSSFIT',1764606600000,60,'Tarvi Torn',14,'Must saal',1,6,10,2352,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2394,'WOD','CROSSFIT',1765211400000,60,'Tarvi Torn',14,'Must saal',1,6,10,2352,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2395,'WOD','CROSSFIT',1765816200000,60,'Tarvi Torn',14,'Must saal',1,6,10,2352,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2396,'WOD','CROSSFIT',1766421000000,60,'Tarvi Torn',14,'Must saal',1,6,10,2352,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2397,'WOD','CROSSFIT',1767025800000,60,'Tarvi Torn',14,'Must saal',1,6,10,2352,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2398,'WOD','CROSSFIT',1767630600000,60,'Tarvi Torn',14,'Must saal',1,6,10,2352,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2399,'WOD','CROSSFIT',1768235400000,60,'Tarvi Torn',14,'Must saal',1,6,10,2352,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2400,'WOD','CROSSFIT',1768840200000,60,'Tarvi Torn',14,'Must saal',1,6,10,2352,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2401,'WOD','CROSSFIT',1769445000000,60,'Tarvi Torn',14,'Must saal',1,6,10,2352,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2402,'WOD','CROSSFIT',1770049800000,60,'Tarvi Torn',14,'Must saal',1,6,10,2352,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2403,'WOD','CROSSFIT',1770654600000,60,'Tarvi Torn',14,'Must saal',1,6,10,2352,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2404,'WOD','CROSSFIT',1771259400000,60,'Tarvi Torn',14,'Must saal',1,6,10,2352,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2405,'Other','OPEN GYM',1739782800000,120,'Tarvi Torn',10,'Must saal',1,6,10,NULL,'','For Time',NULL,1,0);
INSERT INTO ClassSchedule VALUES(2406,'Other','OPEN GYM',1740387600000,120,'Tarvi Torn',10,'Must saal',1,6,10,2405,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2407,'Other','OPEN GYM',1740992400000,120,'Tarvi Torn',1,'Must saal',1,6,10,2405,'','For Time',NULL,1,0);
INSERT INTO ClassSchedule VALUES(2408,'Other','OPEN GYM',1741597200000,120,'Tarvi Torn',10,'Must saal',1,6,10,2405,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2409,'Other','OPEN GYM',1742202000000,120,'Tarvi Torn',10,'Must saal',1,6,10,2405,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2410,'Other','OPEN GYM',1742806800000,120,'Tarvi Torn',10,'Must saal',1,6,10,2405,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2411,'Other','OPEN GYM',1743408000000,120,'Tarvi Torn',10,'Must saal',1,6,10,2405,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2412,'Other','OPEN GYM',1744012800000,120,'Tarvi Torn',10,'Must saal',1,6,10,2405,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2413,'Other','OPEN GYM',1744617600000,120,'Tarvi Torn',10,'Must saal',1,6,10,2405,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2414,'Other','OPEN GYM',1745222400000,120,'Tarvi Torn',10,'Must saal',1,6,10,2405,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2415,'Other','OPEN GYM',1745827200000,120,'Tarvi Torn',10,'Must saal',1,6,10,2405,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2416,'Other','OPEN GYM',1746432000000,120,'Tarvi Torn',10,'Must saal',1,6,10,2405,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2417,'Other','OPEN GYM',1747036800000,120,'Tarvi Torn',10,'Must saal',1,6,10,2405,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2418,'Other','OPEN GYM',1747641600000,120,'Tarvi Torn',10,'Must saal',1,6,10,2405,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2419,'Other','OPEN GYM',1748246400000,120,'Tarvi Torn',10,'Must saal',1,6,10,2405,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2420,'Other','OPEN GYM',1748851200000,120,'Tarvi Torn',10,'Must saal',1,6,10,2405,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2421,'Other','OPEN GYM',1749456000000,120,'Tarvi Torn',10,'Must saal',1,6,10,2405,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2422,'Other','OPEN GYM',1750060800000,120,'Tarvi Torn',10,'Must saal',1,6,10,2405,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2423,'Other','OPEN GYM',1750665600000,120,'Tarvi Torn',10,'Must saal',1,6,10,2405,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2424,'Other','OPEN GYM',1751270400000,120,'Tarvi Torn',10,'Must saal',1,6,10,2405,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2425,'Other','OPEN GYM',1751875200000,120,'Tarvi Torn',10,'Must saal',1,6,10,2405,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2426,'Other','OPEN GYM',1752480000000,120,'Tarvi Torn',10,'Must saal',1,6,10,2405,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2427,'Other','OPEN GYM',1753084800000,120,'Tarvi Torn',10,'Must saal',1,6,10,2405,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2428,'Other','OPEN GYM',1753689600000,120,'Tarvi Torn',10,'Must saal',1,6,10,2405,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2429,'Other','OPEN GYM',1754294400000,120,'Tarvi Torn',10,'Must saal',1,6,10,2405,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2430,'Other','OPEN GYM',1754899200000,120,'Tarvi Torn',10,'Must saal',1,6,10,2405,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2431,'Other','OPEN GYM',1755504000000,120,'Tarvi Torn',10,'Must saal',1,6,10,2405,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2432,'Other','OPEN GYM',1756108800000,120,'Tarvi Torn',10,'Must saal',1,6,10,2405,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2433,'Other','OPEN GYM',1756713600000,120,'Tarvi Torn',10,'Must saal',1,6,10,2405,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2434,'Other','OPEN GYM',1757318400000,120,'Tarvi Torn',10,'Must saal',1,6,10,2405,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2435,'Other','OPEN GYM',1757923200000,120,'Tarvi Torn',10,'Must saal',1,6,10,2405,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2436,'Other','OPEN GYM',1758528000000,120,'Tarvi Torn',10,'Must saal',1,6,10,2405,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2437,'Other','OPEN GYM',1759132800000,120,'Tarvi Torn',10,'Must saal',1,6,10,2405,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2438,'Other','OPEN GYM',1759737600000,120,'Tarvi Torn',10,'Must saal',1,6,10,2405,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2439,'Other','OPEN GYM',1760342400000,120,'Tarvi Torn',10,'Must saal',1,6,10,2405,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2440,'Other','OPEN GYM',1760947200000,120,'Tarvi Torn',10,'Must saal',1,6,10,2405,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2441,'Other','OPEN GYM',1761555600000,120,'Tarvi Torn',10,'Must saal',1,6,10,2405,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2442,'Other','OPEN GYM',1762160400000,120,'Tarvi Torn',10,'Must saal',1,6,10,2405,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2443,'Other','OPEN GYM',1762765200000,120,'Tarvi Torn',10,'Must saal',1,6,10,2405,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2444,'Other','OPEN GYM',1763370000000,120,'Tarvi Torn',10,'Must saal',1,6,10,2405,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2445,'Other','OPEN GYM',1763974800000,120,'Tarvi Torn',10,'Must saal',1,6,10,2405,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2446,'Other','OPEN GYM',1764579600000,120,'Tarvi Torn',10,'Must saal',1,6,10,2405,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2447,'Other','OPEN GYM',1765184400000,120,'Tarvi Torn',10,'Must saal',1,6,10,2405,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2448,'Other','OPEN GYM',1765789200000,120,'Tarvi Torn',10,'Must saal',1,6,10,2405,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2449,'Other','OPEN GYM',1766394000000,120,'Tarvi Torn',10,'Must saal',1,6,10,2405,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2450,'Other','OPEN GYM',1766998800000,120,'Tarvi Torn',10,'Must saal',1,6,10,2405,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2451,'Other','OPEN GYM',1767603600000,120,'Tarvi Torn',10,'Must saal',1,6,10,2405,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2452,'Other','OPEN GYM',1768208400000,120,'Tarvi Torn',10,'Must saal',1,6,10,2405,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2453,'Other','OPEN GYM',1768813200000,120,'Tarvi Torn',10,'Must saal',1,6,10,2405,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2454,'Other','OPEN GYM',1769418000000,120,'Tarvi Torn',10,'Must saal',1,6,10,2405,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2455,'Other','OPEN GYM',1770022800000,120,'Tarvi Torn',10,'Must saal',1,6,10,2405,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2456,'Other','OPEN GYM',1770627600000,120,'Tarvi Torn',10,'Must saal',1,6,10,2405,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2457,'Other','OPEN GYM',1771232400000,120,'Tarvi Torn',10,'Must saal',1,6,10,2405,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2458,'Other','OPEN GYM',1739790000000,120,'Tarvi Torn',10,'Must saal',1,6,10,NULL,'','For Time',NULL,1,0);
INSERT INTO ClassSchedule VALUES(2459,'Other','OPEN GYM',1740394800000,120,'Tarvi Torn',10,'Must saal',1,6,10,2458,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2460,'Other','OPEN GYM',1740999600000,120,'Tarvi Torn',10,'Must saal',1,6,10,2458,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2461,'Other','OPEN GYM',1741604400000,120,'Tarvi Torn',10,'Must saal',1,6,10,2458,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2462,'Other','OPEN GYM',1742209200000,120,'Tarvi Torn',10,'Must saal',1,6,10,2458,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2463,'Other','OPEN GYM',1742814000000,120,'Tarvi Torn',10,'Must saal',1,6,10,2458,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2464,'Other','OPEN GYM',1743415200000,120,'Tarvi Torn',10,'Must saal',1,6,10,2458,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2465,'Other','OPEN GYM',1744020000000,120,'Tarvi Torn',10,'Must saal',1,6,10,2458,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2466,'Other','OPEN GYM',1744624800000,120,'Tarvi Torn',10,'Must saal',1,6,10,2458,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2467,'Other','OPEN GYM',1745229600000,120,'Tarvi Torn',10,'Must saal',1,6,10,2458,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2468,'Other','OPEN GYM',1745834400000,120,'Tarvi Torn',10,'Must saal',1,6,10,2458,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2469,'Other','OPEN GYM',1746439200000,120,'Tarvi Torn',10,'Must saal',1,6,10,2458,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2470,'Other','OPEN GYM',1747044000000,120,'Tarvi Torn',10,'Must saal',1,6,10,2458,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2471,'Other','OPEN GYM',1747648800000,120,'Tarvi Torn',10,'Must saal',1,6,10,2458,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2472,'Other','OPEN GYM',1748253600000,120,'Tarvi Torn',10,'Must saal',1,6,10,2458,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2473,'Other','OPEN GYM',1748858400000,120,'Tarvi Torn',10,'Must saal',1,6,10,2458,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2474,'Other','OPEN GYM',1749463200000,120,'Tarvi Torn',10,'Must saal',1,6,10,2458,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2475,'Other','OPEN GYM',1750068000000,120,'Tarvi Torn',10,'Must saal',1,6,10,2458,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2476,'Other','OPEN GYM',1750672800000,120,'Tarvi Torn',10,'Must saal',1,6,10,2458,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2477,'Other','OPEN GYM',1751277600000,120,'Tarvi Torn',10,'Must saal',1,6,10,2458,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2478,'Other','OPEN GYM',1751882400000,120,'Tarvi Torn',10,'Must saal',1,6,10,2458,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2479,'Other','OPEN GYM',1752487200000,120,'Tarvi Torn',10,'Must saal',1,6,10,2458,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2480,'Other','OPEN GYM',1753092000000,120,'Tarvi Torn',10,'Must saal',1,6,10,2458,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2481,'Other','OPEN GYM',1753696800000,120,'Tarvi Torn',10,'Must saal',1,6,10,2458,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2482,'Other','OPEN GYM',1754301600000,120,'Tarvi Torn',10,'Must saal',1,6,10,2458,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2483,'Other','OPEN GYM',1754906400000,120,'Tarvi Torn',10,'Must saal',1,6,10,2458,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2484,'Other','OPEN GYM',1755511200000,120,'Tarvi Torn',10,'Must saal',1,6,10,2458,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2485,'Other','OPEN GYM',1756116000000,120,'Tarvi Torn',10,'Must saal',1,6,10,2458,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2486,'Other','OPEN GYM',1756720800000,120,'Tarvi Torn',10,'Must saal',1,6,10,2458,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2487,'Other','OPEN GYM',1757325600000,120,'Tarvi Torn',10,'Must saal',1,6,10,2458,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2488,'Other','OPEN GYM',1757930400000,120,'Tarvi Torn',10,'Must saal',1,6,10,2458,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2489,'Other','OPEN GYM',1758535200000,120,'Tarvi Torn',10,'Must saal',1,6,10,2458,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2490,'Other','OPEN GYM',1759140000000,120,'Tarvi Torn',10,'Must saal',1,6,10,2458,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2491,'Other','OPEN GYM',1759744800000,120,'Tarvi Torn',10,'Must saal',1,6,10,2458,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2492,'Other','OPEN GYM',1760349600000,120,'Tarvi Torn',10,'Must saal',1,6,10,2458,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2493,'Other','OPEN GYM',1760954400000,120,'Tarvi Torn',10,'Must saal',1,6,10,2458,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2494,'Other','OPEN GYM',1761562800000,120,'Tarvi Torn',10,'Must saal',1,6,10,2458,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2495,'Other','OPEN GYM',1762167600000,120,'Tarvi Torn',10,'Must saal',1,6,10,2458,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2496,'Other','OPEN GYM',1762772400000,120,'Tarvi Torn',10,'Must saal',1,6,10,2458,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2497,'Other','OPEN GYM',1763377200000,120,'Tarvi Torn',10,'Must saal',1,6,10,2458,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2498,'Other','OPEN GYM',1763982000000,120,'Tarvi Torn',10,'Must saal',1,6,10,2458,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2499,'Other','OPEN GYM',1764586800000,120,'Tarvi Torn',10,'Must saal',1,6,10,2458,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2500,'Other','OPEN GYM',1765191600000,120,'Tarvi Torn',10,'Must saal',1,6,10,2458,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2501,'Other','OPEN GYM',1765796400000,120,'Tarvi Torn',10,'Must saal',1,6,10,2458,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2502,'Other','OPEN GYM',1766401200000,120,'Tarvi Torn',10,'Must saal',1,6,10,2458,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2503,'Other','OPEN GYM',1767006000000,120,'Tarvi Torn',10,'Must saal',1,6,10,2458,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2504,'Other','OPEN GYM',1767610800000,120,'Tarvi Torn',10,'Must saal',1,6,10,2458,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2505,'Other','OPEN GYM',1768215600000,120,'Tarvi Torn',10,'Must saal',1,6,10,2458,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2506,'Other','OPEN GYM',1768820400000,120,'Tarvi Torn',10,'Must saal',1,6,10,2458,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2507,'Other','OPEN GYM',1769425200000,120,'Tarvi Torn',10,'Must saal',1,6,10,2458,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2508,'Other','OPEN GYM',1770030000000,120,'Tarvi Torn',10,'Must saal',1,6,10,2458,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2509,'Other','OPEN GYM',1770634800000,120,'Tarvi Torn',10,'Must saal',1,6,10,2458,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2510,'Other','OPEN GYM',1771239600000,120,'Tarvi Torn',10,'Must saal',1,6,10,2458,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2511,'Other','OPEN GYM',1739797200000,120,'Tarvi Torn',10,'Must saal',1,6,10,NULL,'','For Time',NULL,1,0);
INSERT INTO ClassSchedule VALUES(2512,'Other','OPEN GYM',1740402000000,120,'Tarvi Torn',10,'Must saal',1,6,10,2511,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2513,'Other','OPEN GYM',1741006800000,120,'Tarvi Torn',10,'Must saal',1,6,10,2511,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2514,'Other','OPEN GYM',1741611600000,120,'Tarvi Torn',10,'Must saal',1,6,10,2511,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2515,'Other','OPEN GYM',1742216400000,120,'Tarvi Torn',10,'Must saal',1,6,10,2511,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2516,'Other','OPEN GYM',1742821200000,120,'Tarvi Torn',10,'Must saal',1,6,10,2511,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2517,'Other','OPEN GYM',1743422400000,120,'Tarvi Torn',10,'Must saal',1,6,10,2511,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2518,'Other','OPEN GYM',1744027200000,120,'Tarvi Torn',10,'Must saal',1,6,10,2511,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2519,'Other','OPEN GYM',1744632000000,120,'Tarvi Torn',10,'Must saal',1,6,10,2511,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2520,'Other','OPEN GYM',1745236800000,120,'Tarvi Torn',10,'Must saal',1,6,10,2511,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2521,'Other','OPEN GYM',1745841600000,120,'Tarvi Torn',10,'Must saal',1,6,10,2511,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2522,'Other','OPEN GYM',1746446400000,120,'Tarvi Torn',10,'Must saal',1,6,10,2511,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2523,'Other','OPEN GYM',1747051200000,120,'Tarvi Torn',10,'Must saal',1,6,10,2511,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2524,'Other','OPEN GYM',1747656000000,120,'Tarvi Torn',10,'Must saal',1,6,10,2511,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2525,'Other','OPEN GYM',1748260800000,120,'Tarvi Torn',10,'Must saal',1,6,10,2511,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2526,'Other','OPEN GYM',1748865600000,120,'Tarvi Torn',10,'Must saal',1,6,10,2511,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2527,'Other','OPEN GYM',1749470400000,120,'Tarvi Torn',10,'Must saal',1,6,10,2511,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2528,'Other','OPEN GYM',1750075200000,120,'Tarvi Torn',10,'Must saal',1,6,10,2511,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2529,'Other','OPEN GYM',1750680000000,120,'Tarvi Torn',10,'Must saal',1,6,10,2511,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2530,'Other','OPEN GYM',1751284800000,120,'Tarvi Torn',10,'Must saal',1,6,10,2511,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2531,'Other','OPEN GYM',1751889600000,120,'Tarvi Torn',10,'Must saal',1,6,10,2511,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2532,'Other','OPEN GYM',1752494400000,120,'Tarvi Torn',10,'Must saal',1,6,10,2511,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2533,'Other','OPEN GYM',1753099200000,120,'Tarvi Torn',10,'Must saal',1,6,10,2511,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2534,'Other','OPEN GYM',1753704000000,120,'Tarvi Torn',10,'Must saal',1,6,10,2511,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2535,'Other','OPEN GYM',1754308800000,120,'Tarvi Torn',10,'Must saal',1,6,10,2511,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2536,'Other','OPEN GYM',1754913600000,120,'Tarvi Torn',10,'Must saal',1,6,10,2511,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2537,'Other','OPEN GYM',1755518400000,120,'Tarvi Torn',10,'Must saal',1,6,10,2511,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2538,'Other','OPEN GYM',1756123200000,120,'Tarvi Torn',10,'Must saal',1,6,10,2511,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2539,'Other','OPEN GYM',1756728000000,120,'Tarvi Torn',10,'Must saal',1,6,10,2511,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2540,'Other','OPEN GYM',1757332800000,120,'Tarvi Torn',10,'Must saal',1,6,10,2511,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2541,'Other','OPEN GYM',1757937600000,120,'Tarvi Torn',10,'Must saal',1,6,10,2511,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2542,'Other','OPEN GYM',1758542400000,120,'Tarvi Torn',10,'Must saal',1,6,10,2511,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2543,'Other','OPEN GYM',1759147200000,120,'Tarvi Torn',10,'Must saal',1,6,10,2511,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2544,'Other','OPEN GYM',1759752000000,120,'Tarvi Torn',10,'Must saal',1,6,10,2511,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2545,'Other','OPEN GYM',1760356800000,120,'Tarvi Torn',10,'Must saal',1,6,10,2511,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2546,'Other','OPEN GYM',1760961600000,120,'Tarvi Torn',10,'Must saal',1,6,10,2511,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2547,'Other','OPEN GYM',1761570000000,120,'Tarvi Torn',10,'Must saal',1,6,10,2511,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2548,'Other','OPEN GYM',1762174800000,120,'Tarvi Torn',10,'Must saal',1,6,10,2511,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2549,'Other','OPEN GYM',1762779600000,120,'Tarvi Torn',10,'Must saal',1,6,10,2511,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2550,'Other','OPEN GYM',1763384400000,120,'Tarvi Torn',10,'Must saal',1,6,10,2511,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2551,'Other','OPEN GYM',1763989200000,120,'Tarvi Torn',10,'Must saal',1,6,10,2511,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2552,'Other','OPEN GYM',1764594000000,120,'Tarvi Torn',10,'Must saal',1,6,10,2511,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2553,'Other','OPEN GYM',1765198800000,120,'Tarvi Torn',10,'Must saal',1,6,10,2511,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2554,'Other','OPEN GYM',1765803600000,120,'Tarvi Torn',10,'Must saal',1,6,10,2511,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2555,'Other','OPEN GYM',1766408400000,120,'Tarvi Torn',10,'Must saal',1,6,10,2511,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2556,'Other','OPEN GYM',1767013200000,120,'Tarvi Torn',10,'Must saal',1,6,10,2511,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2557,'Other','OPEN GYM',1767618000000,120,'Tarvi Torn',10,'Must saal',1,6,10,2511,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2558,'Other','OPEN GYM',1768222800000,120,'Tarvi Torn',10,'Must saal',1,6,10,2511,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2559,'Other','OPEN GYM',1768827600000,120,'Tarvi Torn',10,'Must saal',1,6,10,2511,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2560,'Other','OPEN GYM',1769432400000,120,'Tarvi Torn',10,'Must saal',1,6,10,2511,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2561,'Other','OPEN GYM',1770037200000,120,'Tarvi Torn',10,'Must saal',1,6,10,2511,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2562,'Other','OPEN GYM',1770642000000,120,'Tarvi Torn',10,'Must saal',1,6,10,2511,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2563,'Other','OPEN GYM',1771246800000,120,'Tarvi Torn',10,'Must saal',1,6,10,2511,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2564,'Other','OPEN GYM',1739804400000,120,'Tarvi Torn',10,'Must saal',1,6,10,NULL,'','For Time',NULL,1,0);
INSERT INTO ClassSchedule VALUES(2565,'Other','OPEN GYM',1740409200000,120,'Tarvi Torn',10,'Must saal',1,6,10,2564,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2566,'Other','OPEN GYM',1741014000000,120,'Tarvi Torn',10,'Must saal',1,6,10,2564,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2567,'Other','OPEN GYM',1741618800000,120,'Tarvi Torn',10,'Must saal',1,6,10,2564,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2568,'Other','OPEN GYM',1742223600000,120,'Tarvi Torn',10,'Must saal',1,6,10,2564,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2569,'Other','OPEN GYM',1742828400000,120,'Tarvi Torn',10,'Must saal',1,6,10,2564,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2570,'Other','OPEN GYM',1743429600000,120,'Tarvi Torn',10,'Must saal',1,6,10,2564,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2571,'Other','OPEN GYM',1744034400000,120,'Tarvi Torn',10,'Must saal',1,6,10,2564,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2572,'Other','OPEN GYM',1744639200000,120,'Tarvi Torn',10,'Must saal',1,6,10,2564,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2573,'Other','OPEN GYM',1745244000000,120,'Tarvi Torn',10,'Must saal',1,6,10,2564,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2574,'Other','OPEN GYM',1745848800000,120,'Tarvi Torn',10,'Must saal',1,6,10,2564,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2575,'Other','OPEN GYM',1746453600000,120,'Tarvi Torn',10,'Must saal',1,6,10,2564,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2576,'Other','OPEN GYM',1747058400000,120,'Tarvi Torn',10,'Must saal',1,6,10,2564,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2577,'Other','OPEN GYM',1747663200000,120,'Tarvi Torn',10,'Must saal',1,6,10,2564,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2578,'Other','OPEN GYM',1748268000000,120,'Tarvi Torn',10,'Must saal',1,6,10,2564,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2579,'Other','OPEN GYM',1748872800000,120,'Tarvi Torn',10,'Must saal',1,6,10,2564,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2580,'Other','OPEN GYM',1749477600000,120,'Tarvi Torn',10,'Must saal',1,6,10,2564,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2581,'Other','OPEN GYM',1750082400000,120,'Tarvi Torn',10,'Must saal',1,6,10,2564,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2582,'Other','OPEN GYM',1750687200000,120,'Tarvi Torn',10,'Must saal',1,6,10,2564,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2583,'Other','OPEN GYM',1751292000000,120,'Tarvi Torn',10,'Must saal',1,6,10,2564,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2584,'Other','OPEN GYM',1751896800000,120,'Tarvi Torn',10,'Must saal',1,6,10,2564,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2585,'Other','OPEN GYM',1752501600000,120,'Tarvi Torn',10,'Must saal',1,6,10,2564,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2586,'Other','OPEN GYM',1753106400000,120,'Tarvi Torn',10,'Must saal',1,6,10,2564,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2587,'Other','OPEN GYM',1753711200000,120,'Tarvi Torn',10,'Must saal',1,6,10,2564,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2588,'Other','OPEN GYM',1754316000000,120,'Tarvi Torn',10,'Must saal',1,6,10,2564,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2589,'Other','OPEN GYM',1754920800000,120,'Tarvi Torn',10,'Must saal',1,6,10,2564,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2590,'Other','OPEN GYM',1755525600000,120,'Tarvi Torn',10,'Must saal',1,6,10,2564,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2591,'Other','OPEN GYM',1756130400000,120,'Tarvi Torn',10,'Must saal',1,6,10,2564,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2592,'Other','OPEN GYM',1756735200000,120,'Tarvi Torn',10,'Must saal',1,6,10,2564,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2593,'Other','OPEN GYM',1757340000000,120,'Tarvi Torn',10,'Must saal',1,6,10,2564,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2594,'Other','OPEN GYM',1757944800000,120,'Tarvi Torn',10,'Must saal',1,6,10,2564,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2595,'Other','OPEN GYM',1758549600000,120,'Tarvi Torn',10,'Must saal',1,6,10,2564,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2596,'Other','OPEN GYM',1759154400000,120,'Tarvi Torn',10,'Must saal',1,6,10,2564,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2597,'Other','OPEN GYM',1759759200000,120,'Tarvi Torn',10,'Must saal',1,6,10,2564,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2598,'Other','OPEN GYM',1760364000000,120,'Tarvi Torn',10,'Must saal',1,6,10,2564,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2599,'Other','OPEN GYM',1760968800000,120,'Tarvi Torn',10,'Must saal',1,6,10,2564,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2600,'Other','OPEN GYM',1761577200000,120,'Tarvi Torn',10,'Must saal',1,6,10,2564,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2601,'Other','OPEN GYM',1762182000000,120,'Tarvi Torn',10,'Must saal',1,6,10,2564,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2602,'Other','OPEN GYM',1762786800000,120,'Tarvi Torn',10,'Must saal',1,6,10,2564,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2603,'Other','OPEN GYM',1763391600000,120,'Tarvi Torn',10,'Must saal',1,6,10,2564,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2604,'Other','OPEN GYM',1763996400000,120,'Tarvi Torn',10,'Must saal',1,6,10,2564,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2605,'Other','OPEN GYM',1764601200000,120,'Tarvi Torn',10,'Must saal',1,6,10,2564,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2606,'Other','OPEN GYM',1765206000000,120,'Tarvi Torn',10,'Must saal',1,6,10,2564,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2607,'Other','OPEN GYM',1765810800000,120,'Tarvi Torn',10,'Must saal',1,6,10,2564,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2608,'Other','OPEN GYM',1766415600000,120,'Tarvi Torn',10,'Must saal',1,6,10,2564,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2609,'Other','OPEN GYM',1767020400000,120,'Tarvi Torn',10,'Must saal',1,6,10,2564,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2610,'Other','OPEN GYM',1767625200000,120,'Tarvi Torn',10,'Must saal',1,6,10,2564,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2611,'Other','OPEN GYM',1768230000000,120,'Tarvi Torn',10,'Must saal',1,6,10,2564,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2612,'Other','OPEN GYM',1768834800000,120,'Tarvi Torn',10,'Must saal',1,6,10,2564,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2613,'Other','OPEN GYM',1769439600000,120,'Tarvi Torn',10,'Must saal',1,6,10,2564,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2614,'Other','OPEN GYM',1770044400000,120,'Tarvi Torn',10,'Must saal',1,6,10,2564,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2615,'Other','OPEN GYM',1770649200000,120,'Tarvi Torn',10,'Must saal',1,6,10,2564,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2616,'Other','OPEN GYM',1771254000000,120,'Tarvi Torn',10,'Must saal',1,6,10,2564,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2617,'Other','Gymnastics',1739813400000,120,'Taavi Truija',10,'Must saal',1,6,10,NULL,'','For Time',NULL,1,0);
INSERT INTO ClassSchedule VALUES(2618,'Other','Gymnastics',1740418200000,120,'Taavi Truija',10,'Must saal',1,6,10,2617,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2619,'Other','Gymnastics',1741023000000,120,'Taavi Truija',10,'Must saal',1,6,10,2617,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2620,'Other','Gymnastics',1741627800000,120,'Taavi Truija',10,'Must saal',1,6,10,2617,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2621,'Other','Gymnastics',1742232600000,120,'Taavi Truija',10,'Must saal',1,6,10,2617,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2622,'Other','Gymnastics',1742837400000,120,'Taavi Truija',10,'Must saal',1,6,10,2617,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2623,'Other','Gymnastics',1743438600000,120,'Taavi Truija',10,'Must saal',1,6,10,2617,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2624,'Other','Gymnastics',1744043400000,120,'Taavi Truija',10,'Must saal',1,6,10,2617,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2625,'Other','Gymnastics',1744648200000,120,'Taavi Truija',10,'Must saal',1,6,10,2617,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2626,'Other','Gymnastics',1745253000000,120,'Taavi Truija',10,'Must saal',1,6,10,2617,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2627,'Other','Gymnastics',1745857800000,120,'Taavi Truija',10,'Must saal',1,6,10,2617,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2628,'Other','Gymnastics',1746462600000,120,'Taavi Truija',10,'Must saal',1,6,10,2617,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2629,'Other','Gymnastics',1747067400000,120,'Taavi Truija',10,'Must saal',1,6,10,2617,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2630,'Other','Gymnastics',1747672200000,120,'Taavi Truija',10,'Must saal',1,6,10,2617,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2631,'Other','Gymnastics',1748277000000,120,'Taavi Truija',10,'Must saal',1,6,10,2617,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2632,'Other','Gymnastics',1748881800000,120,'Taavi Truija',10,'Must saal',1,6,10,2617,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2633,'Other','Gymnastics',1749486600000,120,'Taavi Truija',10,'Must saal',1,6,10,2617,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2634,'Other','Gymnastics',1750091400000,120,'Taavi Truija',10,'Must saal',1,6,10,2617,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2635,'Other','Gymnastics',1750696200000,120,'Taavi Truija',10,'Must saal',1,6,10,2617,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2636,'Other','Gymnastics',1751301000000,120,'Taavi Truija',10,'Must saal',1,6,10,2617,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2637,'Other','Gymnastics',1751905800000,120,'Taavi Truija',10,'Must saal',1,6,10,2617,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2638,'Other','Gymnastics',1752510600000,120,'Taavi Truija',10,'Must saal',1,6,10,2617,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2639,'Other','Gymnastics',1753115400000,120,'Taavi Truija',10,'Must saal',1,6,10,2617,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2640,'Other','Gymnastics',1753720200000,120,'Taavi Truija',10,'Must saal',1,6,10,2617,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2641,'Other','Gymnastics',1754325000000,120,'Taavi Truija',10,'Must saal',1,6,10,2617,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2642,'Other','Gymnastics',1754929800000,120,'Taavi Truija',10,'Must saal',1,6,10,2617,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2643,'Other','Gymnastics',1755534600000,120,'Taavi Truija',10,'Must saal',1,6,10,2617,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2644,'Other','Gymnastics',1756139400000,120,'Taavi Truija',10,'Must saal',1,6,10,2617,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2645,'Other','Gymnastics',1756744200000,120,'Taavi Truija',10,'Must saal',1,6,10,2617,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2646,'Other','Gymnastics',1757349000000,120,'Taavi Truija',10,'Must saal',1,6,10,2617,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2647,'Other','Gymnastics',1757953800000,120,'Taavi Truija',10,'Must saal',1,6,10,2617,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2648,'Other','Gymnastics',1758558600000,120,'Taavi Truija',10,'Must saal',1,6,10,2617,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2649,'Other','Gymnastics',1759163400000,120,'Taavi Truija',10,'Must saal',1,6,10,2617,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2650,'Other','Gymnastics',1759768200000,120,'Taavi Truija',10,'Must saal',1,6,10,2617,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2651,'Other','Gymnastics',1760373000000,120,'Taavi Truija',10,'Must saal',1,6,10,2617,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2652,'Other','Gymnastics',1760977800000,120,'Taavi Truija',10,'Must saal',1,6,10,2617,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2653,'Other','Gymnastics',1761586200000,120,'Taavi Truija',10,'Must saal',1,6,10,2617,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2654,'Other','Gymnastics',1762191000000,120,'Taavi Truija',10,'Must saal',1,6,10,2617,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2655,'Other','Gymnastics',1762795800000,120,'Taavi Truija',10,'Must saal',1,6,10,2617,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2656,'Other','Gymnastics',1763400600000,120,'Taavi Truija',10,'Must saal',1,6,10,2617,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2657,'Other','Gymnastics',1764005400000,120,'Taavi Truija',10,'Must saal',1,6,10,2617,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2658,'Other','Gymnastics',1764610200000,120,'Taavi Truija',10,'Must saal',1,6,10,2617,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2659,'Other','Gymnastics',1765215000000,120,'Taavi Truija',10,'Must saal',1,6,10,2617,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2660,'Other','Gymnastics',1765819800000,120,'Taavi Truija',10,'Must saal',1,6,10,2617,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2661,'Other','Gymnastics',1766424600000,120,'Taavi Truija',10,'Must saal',1,6,10,2617,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2662,'Other','Gymnastics',1767029400000,120,'Taavi Truija',10,'Must saal',1,6,10,2617,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2663,'Other','Gymnastics',1767634200000,120,'Taavi Truija',10,'Must saal',1,6,10,2617,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2664,'Other','Gymnastics',1768239000000,120,'Taavi Truija',10,'Must saal',1,6,10,2617,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2665,'Other','Gymnastics',1768843800000,120,'Taavi Truija',10,'Must saal',1,6,10,2617,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2666,'Other','Gymnastics',1769448600000,120,'Taavi Truija',10,'Must saal',1,6,10,2617,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2667,'Other','Gymnastics',1770053400000,120,'Taavi Truija',10,'Must saal',1,6,10,2617,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2668,'Other','Gymnastics',1770658200000,120,'Taavi Truija',10,'Must saal',1,6,10,2617,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2669,'Other','Gymnastics',1771263000000,120,'Taavi Truija',10,'Must saal',1,6,10,2617,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2670,'WOD','CROSSFIT',1739989500000,12,'Karl Sasi',12,'',0,2,1,NULL,'','For Time',NULL,1,0);
INSERT INTO ClassSchedule VALUES(2671,'WOD','CROSSFIT2',1740160680000,60,'Joosep Roosaar',14,'Must saal',1,2,1,NULL,'GRACE','For Time','30 Clean and Jerks (61/43 kg) for time',1,0);
INSERT INTO ClassSchedule VALUES(2672,'WOD','CROSSFIT2',1740765480000,60,'Joosep Roosaar',14,'Must saal',1,2,1,2671,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2673,'WOD','CROSSFIT2',1741370280000,60,'Joosep Roosaar',14,'Must saal',1,2,1,2671,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2674,'WOD','CROSSFIT2',1741975080000,60,'Joosep Roosaar',14,'Must saal',1,2,1,2671,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2675,'WOD','CROSSFIT2',1742579880000,60,'Joosep Roosaar',14,'Must saal',1,2,1,2671,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2676,'WOD','CROSSFIT2',1743184680000,60,'Joosep Roosaar',14,'Must saal',1,2,1,2671,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2677,'WOD','CROSSFIT2',1743785880000,60,'Joosep Roosaar',14,'Must saal',1,2,1,2671,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2678,'WOD','CROSSFIT2',1744390680000,60,'Joosep Roosaar',14,'Must saal',1,2,1,2671,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2679,'WOD','CROSSFIT2',1744995480000,60,'Joosep Roosaar',14,'Must saal',1,2,1,2671,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2680,'WOD','CROSSFIT2',1745600280000,60,'Joosep Roosaar',14,'Must saal',1,2,1,2671,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2681,'WOD','CROSSFIT2',1746205080000,60,'Joosep Roosaar',14,'Must saal',1,2,1,2671,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2682,'WOD','CROSSFIT2',1746809880000,60,'Joosep Roosaar',14,'Must saal',1,2,1,2671,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2683,'WOD','CROSSFIT2',1747414680000,60,'Joosep Roosaar',14,'Must saal',1,2,1,2671,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2684,'WOD','CROSSFIT2',1748019480000,60,'Joosep Roosaar',14,'Must saal',1,2,1,2671,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2685,'WOD','CROSSFIT2',1748624280000,60,'Joosep Roosaar',14,'Must saal',1,2,1,2671,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2686,'WOD','CROSSFIT2',1749229080000,60,'Joosep Roosaar',14,'Must saal',1,2,1,2671,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2687,'WOD','CROSSFIT2',1749833880000,60,'Joosep Roosaar',14,'Must saal',1,2,1,2671,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2688,'WOD','CROSSFIT2',1750438680000,60,'Joosep Roosaar',14,'Must saal',1,2,1,2671,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2689,'WOD','CROSSFIT2',1751043480000,60,'Joosep Roosaar',14,'Must saal',1,2,1,2671,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2690,'WOD','CROSSFIT2',1751648280000,60,'Joosep Roosaar',14,'Must saal',1,2,1,2671,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2691,'WOD','CROSSFIT2',1752253080000,60,'Joosep Roosaar',14,'Must saal',1,2,1,2671,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2692,'WOD','CROSSFIT2',1752857880000,60,'Joosep Roosaar',14,'Must saal',1,2,1,2671,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2693,'WOD','CROSSFIT2',1753462680000,60,'Joosep Roosaar',14,'Must saal',1,2,1,2671,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2694,'WOD','CROSSFIT2',1754067480000,60,'Joosep Roosaar',14,'Must saal',1,2,1,2671,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2695,'WOD','CROSSFIT2',1754672280000,60,'Joosep Roosaar',14,'Must saal',1,2,1,2671,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2696,'WOD','CROSSFIT2',1755277080000,60,'Joosep Roosaar',14,'Must saal',1,2,1,2671,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2697,'WOD','CROSSFIT2',1755881880000,60,'Joosep Roosaar',14,'Must saal',1,2,1,2671,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2698,'WOD','CROSSFIT2',1756486680000,60,'Joosep Roosaar',14,'Must saal',1,2,1,2671,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2699,'WOD','CROSSFIT2',1757091480000,60,'Joosep Roosaar',14,'Must saal',1,2,1,2671,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2700,'WOD','CROSSFIT2',1757696280000,60,'Joosep Roosaar',14,'Must saal',1,2,1,2671,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2701,'WOD','CROSSFIT2',1758301080000,60,'Joosep Roosaar',14,'Must saal',1,2,1,2671,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2702,'WOD','CROSSFIT2',1758905880000,60,'Joosep Roosaar',14,'Must saal',1,2,1,2671,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2703,'WOD','CROSSFIT2',1759510680000,60,'Joosep Roosaar',14,'Must saal',1,2,1,2671,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2704,'WOD','CROSSFIT2',1760115480000,60,'Joosep Roosaar',14,'Must saal',1,2,1,2671,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2705,'WOD','CROSSFIT2',1760720280000,60,'Joosep Roosaar',14,'Must saal',1,2,1,2671,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2706,'WOD','CROSSFIT2',1761325080000,60,'Joosep Roosaar',14,'Must saal',1,2,1,2671,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2707,'WOD','CROSSFIT2',1761933480000,60,'Joosep Roosaar',14,'Must saal',1,2,1,2671,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2708,'WOD','CROSSFIT2',1762538280000,60,'Joosep Roosaar',14,'Must saal',1,2,1,2671,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2709,'WOD','CROSSFIT2',1763143080000,60,'Joosep Roosaar',14,'Must saal',1,2,1,2671,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2710,'WOD','CROSSFIT2',1763747880000,60,'Joosep Roosaar',14,'Must saal',1,2,1,2671,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2711,'WOD','CROSSFIT2',1764352680000,60,'Joosep Roosaar',14,'Must saal',1,2,1,2671,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2712,'WOD','CROSSFIT2',1764957480000,60,'Joosep Roosaar',14,'Must saal',1,2,1,2671,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2713,'WOD','CROSSFIT2',1765562280000,60,'Joosep Roosaar',14,'Must saal',1,2,1,2671,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2714,'WOD','CROSSFIT2',1766167080000,60,'Joosep Roosaar',14,'Must saal',1,2,1,2671,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2715,'WOD','CROSSFIT2',1766771880000,60,'Joosep Roosaar',14,'Must saal',1,2,1,2671,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2716,'WOD','CROSSFIT2',1767376680000,60,'Joosep Roosaar',14,'Must saal',1,2,1,2671,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2717,'WOD','CROSSFIT2',1767981480000,60,'Joosep Roosaar',14,'Must saal',1,2,1,2671,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2718,'WOD','CROSSFIT2',1768586280000,60,'Joosep Roosaar',14,'Must saal',1,2,1,2671,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2719,'WOD','CROSSFIT2',1769191080000,60,'Joosep Roosaar',14,'Must saal',1,2,1,2671,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2720,'WOD','CROSSFIT2',1769795880000,60,'Joosep Roosaar',14,'Must saal',1,2,1,2671,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2721,'WOD','CROSSFIT2',1770400680000,60,'Joosep Roosaar',14,'Must saal',1,2,1,2671,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2722,'WOD','CROSSFIT2',1771005480000,60,'Joosep Roosaar',14,'Must saal',1,2,1,2671,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2723,'WOD','CROSSFIT2',1771610280000,60,'Joosep Roosaar',14,'Must saal',1,2,1,2671,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2724,'WOD','CROSSFIT',1740322800000,60,'Karl Sasi',14,'Must saal',1,6,10,NULL,'','For Time',NULL,1,0);
INSERT INTO ClassSchedule VALUES(2725,'WOD','CROSSFIT',1740927600000,60,'Karl Sasi',14,'Must saal',1,6,10,2724,NULL,NULL,NULL,1,1);
INSERT INTO ClassSchedule VALUES(2726,'WOD','CROSSFIT',1741532400000,60,'Karl Sasi',14,'Must saal',1,6,10,2724,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2727,'WOD','CROSSFIT',1742137200000,60,'Karl Sasi',14,'Must saal',1,6,10,2724,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2728,'WOD','CROSSFIT',1742742000000,60,'Karl Sasi',14,'Must saal',1,6,10,2724,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2729,'WOD','CROSSFIT',1743343200000,60,'Karl Sasi',14,'Must saal',1,6,10,2724,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2730,'WOD','CROSSFIT',1743948000000,60,'Karl Sasi',14,'Must saal',1,6,10,2724,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2731,'WOD','CROSSFIT',1744552800000,60,'Karl Sasi',14,'Must saal',1,6,10,2724,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2732,'WOD','CROSSFIT',1745157600000,60,'Karl Sasi',14,'Must saal',1,6,10,2724,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2733,'WOD','CROSSFIT',1745762400000,60,'Karl Sasi',14,'Must saal',1,6,10,2724,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2734,'WOD','CROSSFIT',1746367200000,60,'Karl Sasi',14,'Must saal',1,6,10,2724,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2735,'WOD','CROSSFIT',1746972000000,60,'Karl Sasi',14,'Must saal',1,6,10,2724,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2736,'WOD','CROSSFIT',1747576800000,60,'Karl Sasi',14,'Must saal',1,6,10,2724,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2737,'WOD','CROSSFIT',1748181600000,60,'Karl Sasi',14,'Must saal',1,6,10,2724,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2738,'WOD','CROSSFIT',1748786400000,60,'Karl Sasi',14,'Must saal',1,6,10,2724,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2739,'WOD','CROSSFIT',1749391200000,60,'Karl Sasi',14,'Must saal',1,6,10,2724,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2740,'WOD','CROSSFIT',1749996000000,60,'Karl Sasi',14,'Must saal',1,6,10,2724,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2741,'WOD','CROSSFIT',1750600800000,60,'Karl Sasi',14,'Must saal',1,6,10,2724,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2742,'WOD','CROSSFIT',1751205600000,60,'Karl Sasi',14,'Must saal',1,6,10,2724,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2743,'WOD','CROSSFIT',1751810400000,60,'Karl Sasi',14,'Must saal',1,6,10,2724,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2744,'WOD','CROSSFIT',1752415200000,60,'Karl Sasi',14,'Must saal',1,6,10,2724,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2745,'WOD','CROSSFIT',1753020000000,60,'Karl Sasi',14,'Must saal',1,6,10,2724,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2746,'WOD','CROSSFIT',1753624800000,60,'Karl Sasi',14,'Must saal',1,6,10,2724,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2747,'WOD','CROSSFIT',1754229600000,60,'Karl Sasi',14,'Must saal',1,6,10,2724,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2748,'WOD','CROSSFIT',1754834400000,60,'Karl Sasi',14,'Must saal',1,6,10,2724,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2749,'WOD','CROSSFIT',1755439200000,60,'Karl Sasi',14,'Must saal',1,6,10,2724,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2750,'WOD','CROSSFIT',1756044000000,60,'Karl Sasi',14,'Must saal',1,6,10,2724,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2751,'WOD','CROSSFIT',1756648800000,60,'Karl Sasi',14,'Must saal',1,6,10,2724,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2752,'WOD','CROSSFIT',1757253600000,60,'Karl Sasi',14,'Must saal',1,6,10,2724,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2753,'WOD','CROSSFIT',1757858400000,60,'Karl Sasi',14,'Must saal',1,6,10,2724,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2754,'WOD','CROSSFIT',1758463200000,60,'Karl Sasi',14,'Must saal',1,6,10,2724,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2755,'WOD','CROSSFIT',1759068000000,60,'Karl Sasi',14,'Must saal',1,6,10,2724,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2756,'WOD','CROSSFIT',1759672800000,60,'Karl Sasi',14,'Must saal',1,6,10,2724,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2757,'WOD','CROSSFIT',1760277600000,60,'Karl Sasi',14,'Must saal',1,6,10,2724,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2758,'WOD','CROSSFIT',1760882400000,60,'Karl Sasi',14,'Must saal',1,6,10,2724,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2759,'WOD','CROSSFIT',1761490800000,60,'Karl Sasi',14,'Must saal',1,6,10,2724,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2760,'WOD','CROSSFIT',1762095600000,60,'Karl Sasi',14,'Must saal',1,6,10,2724,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2761,'WOD','CROSSFIT',1762700400000,60,'Karl Sasi',14,'Must saal',1,6,10,2724,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2762,'WOD','CROSSFIT',1763305200000,60,'Karl Sasi',14,'Must saal',1,6,10,2724,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2763,'WOD','CROSSFIT',1763910000000,60,'Karl Sasi',14,'Must saal',1,6,10,2724,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2764,'WOD','CROSSFIT',1764514800000,60,'Karl Sasi',14,'Must saal',1,6,10,2724,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2765,'WOD','CROSSFIT',1765119600000,60,'Karl Sasi',14,'Must saal',1,6,10,2724,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2766,'WOD','CROSSFIT',1765724400000,60,'Karl Sasi',14,'Must saal',1,6,10,2724,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2767,'WOD','CROSSFIT',1766329200000,60,'Karl Sasi',14,'Must saal',1,6,10,2724,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2768,'WOD','CROSSFIT',1766934000000,60,'Karl Sasi',14,'Must saal',1,6,10,2724,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2769,'WOD','CROSSFIT',1767538800000,60,'Karl Sasi',14,'Must saal',1,6,10,2724,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2770,'WOD','CROSSFIT',1768143600000,60,'Karl Sasi',14,'Must saal',1,6,10,2724,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2771,'WOD','CROSSFIT',1768748400000,60,'Karl Sasi',14,'Must saal',1,6,10,2724,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2772,'WOD','CROSSFIT',1769353200000,60,'Karl Sasi',14,'Must saal',1,6,10,2724,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2773,'WOD','CROSSFIT',1769958000000,60,'Karl Sasi',14,'Must saal',1,6,10,2724,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2774,'WOD','CROSSFIT',1770562800000,60,'Karl Sasi',14,'Must saal',1,6,10,2724,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2775,'WOD','CROSSFIT',1771167600000,60,'Karl Sasi',14,'Must saal',1,6,10,2724,NULL,NULL,NULL,1,0);
INSERT INTO ClassSchedule VALUES(2776,'WOD','CROSSFIT',1771772400000,60,'Karl Sasi',14,'Must saal',1,6,10,2724,NULL,NULL,NULL,1,0);
CREATE TABLE IF NOT EXISTS "User" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "fullName" TEXT,
    "affiliateOwner" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "monthlyGoal" INTEGER,
    "isAcceptedTerms" BOOLEAN NOT NULL DEFAULT false,
    "phone" TEXT,
    "address" TEXT,
    "logo" TEXT,
    "homeAffiliate" INTEGER
);
INSERT INTO User VALUES(1,'a@a.a','$2b$10$ITNZmTGLWeI0OUBcg0Z6c.ytApjxuHPumMZZHwo0yX0UWOLbFOxpm','Sander Prii2',0,1737547508429,NULL,0,'55656565',NULL,NULL,10);
INSERT INTO User VALUES(2,'b@b.b','$2b$10$24nnApK0B94jywcxhNxqe.5qbq2BX7jcdcmTMNX5xUUDvGtQCu.ja','asd',1,1737553951494,NULL,0,NULL,NULL,NULL,NULL);
INSERT INTO User VALUES(5,'c@c.c','$2b$10$OgnssFdOCtXb./TgYkMcNOM.8NFZbUThigIN.LWdg.zUpJCWe8aPG','Mati Testija2',0,1738004558172,NULL,1,'55656565','asdasd','data:image/jpeg;base64,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',10);
INSERT INTO User VALUES(6,'d@d.d','$2b$10$whhsYiO2RmqdX99TCazAkOJjnDi7iIEZRK72a/BXc7hzwcVX1CiDe','asd',1,1738046044319,NULL,0,NULL,NULL,NULL,NULL);
INSERT INTO User VALUES(7,'sander.prii@vikk.ee','$2b$10$J0CTr.RA0/WPqaBm4E1pOOeP4ASDzuLqSloyQUbvn1nfh96kVzxfS','asd',0,1738745068793,NULL,0,NULL,NULL,NULL,NULL);
INSERT INTO User VALUES(8,'s@s.e','$2b$10$GlB3m88fuxnqTb6bG9Ns7.OFrXrJoW8aWg2ADpJwrWMTGWbxbp2Em','asd',0,1738751263465,NULL,0,NULL,NULL,NULL,NULL);
INSERT INTO User VALUES(9,'prii.sander@gmail.com','$2b$10$5jVQiXQcJjNJ26v.qI7ZaOvvWW.Cb2Mtr00NpitjDeMRQEzuZWPHi','asd',0,1738751962995,NULL,0,NULL,NULL,NULL,10);
INSERT INTO User VALUES(10,'g@g.g','$2b$10$zsd9.nL10T10EKojrqliqe5K7LY/DnbDZFmfx3JejJqAuC6SVVrIC','Kati Testija',0,1738831102031,NULL,0,'533256456','lehe 10,asdas',NULL,NULL);
INSERT INTO User VALUES(11,'l@l.l','$2b$10$Yzg0ZS6l6IR8ollK8EAgVeKNqe5bCD27ivpg1TKqtiEm0xR1gaabC','g@g.g',0,1740479619109,NULL,1,'546546546','',NULL,NULL);
CREATE TABLE IF NOT EXISTS "Plan" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "validityDays" INTEGER NOT NULL,
    "price" REAL NOT NULL,
    "additionalData" TEXT,
    "sessions" INTEGER NOT NULL,
    "affiliateId" INTEGER NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "ownerId" INTEGER NOT NULL,
    CONSTRAINT "Plan_affiliateId_fkey" FOREIGN KEY ("affiliateId") REFERENCES "Affiliate" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Plan_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "Plan" VALUES(1,'Unlimited',99,50.0,'',9999,10,1,6);
CREATE TABLE IF NOT EXISTS "AffiliateApiKeys" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "affiliateId" INTEGER NOT NULL,
    "accessKey" TEXT NOT NULL,
    "secretKey" TEXT NOT NULL,
    CONSTRAINT "AffiliateApiKeys_affiliateId_fkey" FOREIGN KEY ("affiliateId") REFERENCES "Affiliate" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO AffiliateApiKeys VALUES(1,10,'26268941-938c-4a62-a17a-58f407f070b9','KvXci3X93Tb9r1K/PlQkHhSAQ3b5ZzisYG3n4yu7bASq');
CREATE TABLE IF NOT EXISTS "PaymentHoliday" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "contractId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    "affiliateId" INTEGER NOT NULL,
    "month" TEXT NOT NULL,
    "reason" TEXT,
    "monthlyFee" REAL NOT NULL DEFAULT 0.0,
    "accepted" TEXT NOT NULL DEFAULT 'pending',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "PaymentHoliday_contractId_fkey" FOREIGN KEY ("contractId") REFERENCES "Contract" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "PaymentHoliday_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "PaymentHoliday_affiliateId_fkey" FOREIGN KEY ("affiliateId") REFERENCES "Affiliate" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
CREATE TABLE IF NOT EXISTS "paymentMetadata" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "transactionId" INTEGER NOT NULL,
    "montonioUuid" TEXT NOT NULL,
    "contractId" INTEGER NOT NULL,
    "affiliateId" INTEGER NOT NULL,
    "isPaymentHoliday" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO paymentMetadata VALUES(21,120,'5814e9f6-fb7b-47d7-bdb2-ec6265b538fe',2,10,0,1740938972439);
INSERT INTO paymentMetadata VALUES(22,121,'0e598789-58b8-49d7-b89a-d91ac11346d3',1,10,0,1740939514251);
INSERT INTO paymentMetadata VALUES(23,122,'4f7764c3-cf62-43cd-abac-af05931a2c29',1,10,0,1740939587825);
INSERT INTO paymentMetadata VALUES(24,123,'ae5fe885-f140-45c7-929d-c667a9a3407c',1,10,0,1740939644001);
INSERT INTO paymentMetadata VALUES(25,126,'5a1090ba-26a6-4c8a-adde-715ff49bcd8c',1,10,0,1740940488334);
INSERT INTO paymentMetadata VALUES(26,128,'32a1247c-12e3-425f-a7c8-7e090c10cc7f',1,10,1,1741112220681);
CREATE TABLE IF NOT EXISTS "Waitlist" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "classId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    "userPlanId" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Waitlist_classId_fkey" FOREIGN KEY ("classId") REFERENCES "ClassSchedule" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Waitlist_userPlanId_fkey" FOREIGN KEY ("userPlanId") REFERENCES "UserPlan" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Waitlist_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
CREATE TABLE IF NOT EXISTS "Contract" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "affiliateId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    "contractType" TEXT,
    "content" TEXT NOT NULL,
    "paymentType" TEXT,
    "paymentAmount" REAL,
    "paymentInterval" TEXT,
    "paymentDay" INTEGER,
    "validUntil" DATETIME,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "status" TEXT NOT NULL DEFAULT 'draft',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "acceptedAt" DATETIME,
    CONSTRAINT "Contract_affiliateId_fkey" FOREIGN KEY ("affiliateId") REFERENCES "Affiliate" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Contract_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO Contract VALUES(1,10,5,'MonthlyMembership',replace('Leping nr [X]\nSõlmitud: [kuupäev]\n\nLepingupooled:\n\nCrossFit Tartu\n\nOmanik: Ain Lubi\nAsukoht: Tartu, Aardla\nedaspidi „Teenusepakkuja” või „Affiliate“\n[Kliendi nimi ja isikukood]\n\n[Kontaktandmed: aadress, telefon, e-post]\nedaspidi „Klient”\n1. Lepingu ese\n1.1 Käesoleva lepingu esemeks on CrossFit Tartu poolt pakutavate treeningvõimaluste, sh rühmatreeningute, iseseisva treeningu ja muude seotud teenuste kasutamise õigus.\n1.2 Leping on tähtajatu ning Klient võib tasu eest kasutada Teenusepakkuja treeningteenuseid käesolevas lepingus sätestatud tingimustel.\n\n2. Liikmemaks ja maksetingimused\n2.1 Klient kohustub tasuma igakuist liikmemaksu summas [X eurot].\n2.2 Liikmemaks kuulub tasumisele hiljemalt iga kuu 15. kuupäevaks.\n2.3 Maksetingimused (sh arveldusarve number, selgitus jms) määratakse Teenusepakkuja poolt. Klient vastutab õigeaegse ning õige viitenumbriga tasumise eest.\n2.4 Viivitusintressi või leppetrahvi võidakse rakendada vastavalt Teenusepakkuja kehtestatud üldtingimustele, kui Klient ei ole kokkulepitud tähtpäevaks liikmemaksu tasunud. Teenusepakkuja võib samuti peatada Kliendi treeninguõiguse, kuni võlgnevus on tasutud.\n\n3. Teenuste kasutamine\n3.1 Klient on kohustatud tutvuma CrossFit Tartu sisekorraeeskirjadega (sh turvalisus, hügieen, treeningute registreerimine, tühistamise kord jms) ja neid täitma.\n3.2 Teenusepakkujal on õigus ajutiselt piirata treeningute või ruumide kasutamist seoses remondi, hooldustööde või muude etteplaneeritud tegevustega, teavitades sellest mõistliku aja jooksul ette.\n3.3 Teenusepakkuja võib teha muudatusi treeningute ajakavas, hinnakirjas või sisukorras, teavitades sellest Kliendi e-posti või veebilehe vahendusel. Oluliste muudatuste puhul on Kliendil õigus leping üles öelda, teatades sellest 14 päeva ette.\n\n4. Lepingu kestus ja lõpetamine\n4.1 Leping jõustub selle allkirjastamisest (või digiallkirjast) ning on sõlmitud tähtajatult.\n4.2 Klient võib lepingu igal ajal üles öelda, esitades Teenusepakkujale kirjaliku (või digitaalse) avalduse. Lepingu lõppemisest tulenevalt arvestatakse liikmemaks proportsionaalselt selle kuu kasutusajaga või vastavalt Teenusepakkuja üldtingimustele.\n4.3 Teenusepakkuja võib lepingu erakorraliselt lõpetada, kui Klient on oluliselt lepingut rikkunud (näiteks korduv makseviivitus või sisekorraeeskirjade rikkumine).\n\n5. Vastutus ja pretensioonid\n5.1 Teenusepakkuja vastutab Kliendi ees üksnes siis, kui kahju või kahjustus on põhjustatud Teenusepakkuja raskest hooletusest või tahtlikust tegevusest.\n5.2 Klient vastutab oma tervisliku seisundi eest ning on kohustatud veenduma, et tal pole vastunäidustusi treeningutes osalemiseks.\n5.3 Kui Kliendil on kaebusi või pretensioone, lahendatakse need esmalt heas usus läbirääkimiste teel. Vaidluste jätkumisel on Kliendil õigus pöörduda Tarbijakaitse ja Tehnilise Järelevalve Ameti või kohtusse vastavalt Eesti Vabariigi seadustele.\n\n6. Isikuandmete kaitse ja GDPR\n6.1 Teenusepakkuja töötleb Kliendi isikuandmeid (nt nimi, kontaktandmed, makseinfo) üksnes teenuste osutamiseks, lepingu täitmiseks, raamatupidamis- või juriidiliste kohustuste täitmiseks vastavalt Euroopa Liidu isikuandmete kaitse üldmäärusele (GDPR) ja Eesti seadustele.\n6.2 Klient võib igal ajal küsida teavet enda isikuandmete töötlemise kohta ning taotleda parandamist, kustutamist või töötlemise piiramist, kui see ei ole vastuolus seadusest tulenevate kohustustega.\n\n7. Muud tingimused\n7.1 Poolte vahelised teated loetakse kehtivaks, kui need on edastatud e-posti teel, kirjalikult või muus tõendatavas vormis.\n7.2 Kõik lepingus puuduvad küsimused ja suhted lahendatakse vastavalt Eesti Vabariigi kehtivatele õigusaktidele.\n7.3 Kokkuleppe muutmine või täiendamine toimub kirjalikult või digiallkirjastatud lisakokkuleppega.\n\n8. Allkirjastamine ja jõustumine\n8.1 Klient kinnitab, et on käesoleva lepingu ja teenusepakkuja Terms and Conditions (üldtingimuste) sisust aru saanud ning nõustub nendega.\n8.2 Leping loetakse sõlmituks ning õiguslikult siduvaks hetkest, mil Klient on lepingu allkirjastanud (sh digiallkirjastanud) või klõpsanud „Accept” (nõustun) nuppu.\n\nPOOLTE ALLEKIRJAD\n\nCrossFit Tartu\n(omanik Ain Lubi)\nAllkiri: …………………….. Kuupäev: ………………\n\nKlient\n[nimi ja isikukood]\nAllkiri: …………………….. Kuupäev: ………………','\n',char(10)),'cred',55.0,'month',9,1752192000000,1,'accepted',1740939370309,1740940506658);
DELETE FROM sqlite_sequence;
INSERT INTO sqlite_sequence VALUES('Affiliate',10);
INSERT INTO sqlite_sequence VALUES('Training',10);
INSERT INTO sqlite_sequence VALUES('Exercise',19);
INSERT INTO sqlite_sequence VALUES('defaultWOD',395);
INSERT INTO sqlite_sequence VALUES('Record',19);
INSERT INTO sqlite_sequence VALUES('AffiliateTrainer',10);
INSERT INTO sqlite_sequence VALUES('todayWOD',14);
INSERT INTO sqlite_sequence VALUES('ClassLeaderboard',14);
INSERT INTO sqlite_sequence VALUES('Members',10);
INSERT INTO sqlite_sequence VALUES('Credit',6);
INSERT INTO sqlite_sequence VALUES('UserNote',6);
INSERT INTO sqlite_sequence VALUES('MessageGroup',4);
INSERT INTO sqlite_sequence VALUES('UserMessageGroup',3);
INSERT INTO sqlite_sequence VALUES('Message',63);
INSERT INTO sqlite_sequence VALUES('ContractLogs',26);
INSERT INTO sqlite_sequence VALUES('SignedContract',17);
INSERT INTO sqlite_sequence VALUES('ContractTerms',2);
INSERT INTO sqlite_sequence VALUES('transactions',130);
INSERT INTO sqlite_sequence VALUES('ClassAttendee',24);
INSERT INTO sqlite_sequence VALUES('UserPlan',74);
INSERT INTO sqlite_sequence VALUES('ClassSchedule',2776);
INSERT INTO sqlite_sequence VALUES('User',11);
INSERT INTO sqlite_sequence VALUES('Plan',1);
INSERT INTO sqlite_sequence VALUES('AffiliateApiKeys',1);
INSERT INTO sqlite_sequence VALUES('PaymentHoliday',6);
INSERT INTO sqlite_sequence VALUES('paymentMetadata',26);
INSERT INTO sqlite_sequence VALUES('Waitlist',8);
INSERT INTO sqlite_sequence VALUES('Contract',1);
CREATE UNIQUE INDEX "defaultWOD_name_key" ON "defaultWOD"("name");
CREATE UNIQUE INDEX "AffiliateTrainer_affiliateId_trainerId_key" ON "AffiliateTrainer"("affiliateId", "trainerId");
CREATE UNIQUE INDEX "Members_userId_affiliateId_key" ON "Members"("userId", "affiliateId");
CREATE UNIQUE INDEX "Credit_userId_affiliateId_key" ON "Credit"("userId", "affiliateId");
CREATE UNIQUE INDEX "ClassAttendee_classId_userId_key" ON "ClassAttendee"("classId", "userId");
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
CREATE UNIQUE INDEX "paymentMetadata_montonioUuid_contractId_key" ON "paymentMetadata"("montonioUuid", "contractId");
CREATE UNIQUE INDEX "Waitlist_classId_userId_key" ON "Waitlist"("classId", "userId");
CREATE UNIQUE INDEX "Affiliate_subdomain_key" ON "Affiliate"("subdomain");
COMMIT;
