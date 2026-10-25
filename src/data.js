export const products = [
 {sku:'2807',name:'Футболка базовая',price:1200,cost:400,plan:110,stock:50,warehouse:'Коледино',campaign:'41141431',impressions:50000,clicks:1000,adOrders:100,spend:18000},
 {sku:'2807-3',name:'Лонгслив хлопковый',price:1800,cost:650,plan:80,stock:180,warehouse:'Казань',campaign:'27201459',impressions:25000,clicks:1000,adOrders:50,spend:4500},
 {sku:'2807-6',name:'Худи оверсайз',price:3000,cost:1100,plan:70,stock:120,warehouse:'Электросталь',campaign:'37235374',impressions:20000,clicks:1000,adOrders:50,spend:6000},
 {sku:'81859',name:'Сумка повседневная',price:2000,cost:700,plan:45,stock:90,warehouse:'Краснодар',campaign:'28904477',impressions:15000,clicks:600,adOrders:30,spend:3000}
];
export const sales = [[15,11,7,5],[17,12,8,6],[14,10,7,5],[18,15,10,7],[16,13,9,6],[17,15,10,6],[20,14,9,5]];
export const dates = Array.from({length:7},(_,i)=>`2026-10-${19+i}`);
export function calculate(skus=products,indices=[0,1,2,3,4,5,6]) {
 const rows=skus.map(p=>{const index=products.indexOf(p);const units=indices.reduce((n,i)=>n+sales[i][index],0);const ratio=indices.length/7;const revenue=units*p.price;const spend=p.spend*ratio;const adOrders=Math.round(p.adOrders*ratio);return {...p,units,revenue,spend,adOrders,impressions:Math.round(p.impressions*ratio),clicks:Math.round(p.clicks*ratio),plan:p.plan*ratio,planRevenue:p.plan*ratio*p.price,cogs:units*p.cost,commission:revenue*.15,logistics:units*80,other:revenue*.05,adRevenue:adOrders*p.price,days:units ? p.stock/(units/Math.max(indices.length,1)):null};});
 const total=Object.fromEntries(['units','revenue','spend','adOrders','impressions','clicks','plan','planRevenue','cogs','commission','logistics','other','adRevenue','stock'].map(k=>[k,rows.reduce((s,p)=>s+p[k],0)]));
 total.margin=total.revenue-total.cogs-total.commission-total.logistics-total.other-total.spend;
 return {rows,total};
}
