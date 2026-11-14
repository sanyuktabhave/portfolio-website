import test from 'node:test'
import assert from 'node:assert/strict'
import {flowerPhase} from '../src/flower-trail.js'
test('new pointer samples never create negative petal radii',()=>{
  assert.equal(flowerPhase(100,105).grow,0)
  for(const age of [-20,0,20,180,900,1600,2000]){
    const {grow,fade}=flowerPhase(1000+age,1000)
    assert.ok(grow>=0&&grow<=1)
    assert.ok(fade>=0&&fade<=1)
  }
})
test('flowers grow and then fade away',()=>{
  assert.equal(flowerPhase(1180,1000).grow,1)
  assert.equal(flowerPhase(2700,1000).fade,0)
})
