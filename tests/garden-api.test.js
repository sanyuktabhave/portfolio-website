import test from 'node:test'
import assert from 'node:assert/strict'
import {gardenUrl,gardenKey} from '../src/garden-config.js'
const headers={apikey:gardenKey,'Content-Type':'application/json'}
const call=(path,options={})=>fetch(`${gardenUrl}/rest/v1/${path}`,{...options,headers,signal:AbortSignal.timeout(15000)})
test('flowers are readable without visitor accounts',async()=>{
  const response=await call('garden_flowers?select=id,drawing,created_at&limit=1')
  assert.equal(response.status,200)
  assert.ok(Array.isArray(await response.json()))
})
test('invalid or executable drawing data is rejected',async()=>{
  for(const drawing of [[],[{color:'#52233b'}],[{color:'#52233b',points:[[900,10]]}],[{color:'<script>',points:[[10,10]]}]]){
    const response=await call('rpc/plant_garden_flower',{method:'POST',body:JSON.stringify({drawing})})
    assert.equal(response.status,400)
  }
})
test('visitors cannot insert directly, edit, or delete flowers',async()=>{
  const insert=await call('garden_flowers',{method:'POST',body:JSON.stringify({drawing:[]})})
  assert.ok([401,403].includes(insert.status))
  for(const method of ['PATCH','DELETE']){
    const response=await call('garden_flowers?id=eq.00000000-0000-0000-0000-000000000000',{method,...(method==='PATCH'?{body:JSON.stringify({drawing:[]})}:{})})
    assert.ok([401,403].includes(response.status))
  }
})
