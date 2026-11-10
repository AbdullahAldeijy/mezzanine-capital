export default function about(t, { esc }) {
  const a = t.about;
  return `
<section id="about" class="section" aria-labelledby="about-title">
  <div class="container">
    <div class="about-grid">
      <h2 id="about-title" class="h2 rv">${esc(a.title)}</h2>
      <p class="about-text rv">${esc(a.text)}</p>
    </div>
    <div class="vm rv">
      <div><h3 class="h3">${esc(a.vision.title)}</h3><p>${esc(a.vision.text)}</p></div>
      <div><h3 class="h3">${esc(a.mission.title)}</h3><p>${esc(a.mission.text)}</p></div>
    </div>
  </div>
</section>`;
}
