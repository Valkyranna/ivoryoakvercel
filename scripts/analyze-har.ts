const har = await Bun.file('har.json').json()
const entries = har.log.entries as Array<{
  request: { url: string }
  response: { status: number; bodySize: number; transferSize: number }
  time: number
  pageref?: string
}>

console.log('📊 HAR Analysis\n')

// Total requests
console.log(`Total Requests: ${entries.length}`)

// Total size
let totalSize = 0
let totalTransfer = 0
entries.forEach((e) => {
  totalSize += e.response.bodySize || 0
  totalTransfer += e.response.transferSize || 0
})
console.log(`Total Size: ${(totalSize / 1024).toFixed(0)}KB`)
console.log(`Total Transfer: ${(totalTransfer / 1024).toFixed(0)}KB`)

// Slowest requests
const slowest = entries
  .map((e) => ({
    url: e.request.url.split('/').pop() || e.request.url,
    time: e.time,
    size: e.response.bodySize,
  }))
  .sort((a, b) => b.time - a.time)
  .slice(0, 10)

console.log('\n🐢 Slowest Requests:')
slowest.forEach((s: { url: string; time: number; size: number }, i: number) => {
  console.log(`  ${i + 1}. ${s.url.padEnd(35)} | ${s.time.toFixed(0)}ms | ${(s.size / 1024).toFixed(0)}KB`)
})

// Status codes
const statusCounts: Record<string, number> = {}
entries.forEach((e) => {
  const code = String(e.response.status)
  statusCounts[code] = (statusCounts[code] || 0) + 1
})
console.log('\n🔢 Status Codes:', JSON.stringify(statusCounts))

// Page timings
const page = har.log.pages[0] as {
  pageTimings: {
    _navigation_timing: {
      responseStart: number
      navigationStart: number
    }
    onContentLoad: number
    onLoad: number
    _fullyLoaded: number
  }
}
console.log('\n⏱️  Page Timings:')
console.log(`  TTFB: ${(page.pageTimings._navigation_timing.responseStart - page.pageTimings._navigation_timing.navigationStart)}ms`)
console.log(`  DOM Content Loaded: ${page.pageTimings.onContentLoad}ms`)
console.log(`  Page Load: ${page.pageTimings.onLoad}ms`)
console.log(`  Fully Loaded: ${page.pageTimings._fullyLoaded}ms`)
