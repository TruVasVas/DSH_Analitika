export const items=[{sku:'2807',name:'Футболка базовая',price:1500,cost:480,stock:240},{sku:'2807-3',name:'Лонгслив хлопковый',price:2200,cost:760,stock:320},{sku:'2807-6',name:'Худи оверсайз',price:3500,cost:1250,stock:180}];
export const types={WB:['Единая','Ручная','CPC'],Ozon:['CPC','Оплата за заказ']};
export const dates=Array.from({length:28},(_,i)=>new Date(Date.UTC(2026,8,28+i)).toISOString().slice(0,10));
export const records=Object.keys(types).flatMap((market,m)=>dates.flatMap((date,d)=>items.map((item,p)=>{
 const orders=22+((d*7+p*11+m*5)%23),cancelled=1+(d+p)%3,returned=(d+p+m)%3,pending=2+(d+p)%4,buyouts=orders-cancelled-returned-pending;
 return {market,date,sku:item.sku,orders,cancelled,returned,pending,buyouts,revenue:buyouts*item.price,orderRevenue:orders*item.price,cogs:buyouts*item.cost,commission:buyouts*item.price*.15,logistics:(buyouts+returned)*90,other:buyouts*item.price*.05,
 ads:types[market].map((type,k)=>{const impressions=2200+(d*277+p*509+k*337+m*173)%2800;const clicks=Math.round(impressions*(.025+((d+p+k)%7)*.003));const baskets=Math.round(clicks*.4);const adOrders=Math.min(Math.round(clicks*(.09+k*.015)),Math.floor(orders*.8/types[market].length));const spend=type==='Оплата за заказ'?adOrders*115:Math.round(clicks*(12+((d+p+k)%6)));return {type,impressions,clicks,baskets,adOrders,adRevenue:adOrders*item.price,spend};})};})));
export function aggregate(rows,type='Общая'){
 const keys=['orders','cancelled','returned','pending','buyouts','revenue','orderRevenue','cogs','commission','logistics','other'];const t=Object.fromEntries([...keys,'impressions','clicks','baskets','adOrders','adRevenue','spend'].map(k=>[k,0]));
 for(const r of rows){for(const k of keys)t[k]+=r[k];for(const a of r.ads.filter(a=>type==='Общая'||a.type===type))for(const k of ['impressions','clicks','baskets','adOrders','adRevenue','spend'])t[k]+=a[k];}
 const div=(a,b,scale=1)=>b?a/b*scale:null;
 return {...t,buyoutRate:div(t.buyouts,t.orders,100),avgCheck:div(t.revenue,t.buyouts),drr:div(t.spend,t.revenue,100),adDrr:div(t.spend,t.adRevenue,100),ctr:div(t.clicks,t.impressions,100),cr:div(t.adOrders,t.clicks,100),cpm:div(t.spend,t.impressions,1000),cpc:div(t.spend,t.clicks),cpb:div(t.spend,t.baskets),cpo:div(t.spend,t.adOrders),margin:t.revenue-t.cogs-t.commission-t.logistics-t.other-t.spend};
}
