import './style.css'
import YAML from 'yaml'
import siteYaml from '../content/site.yaml?raw'
import papersYaml from '../content/papers.yaml?raw'
import educationYaml from '../content/education.yaml?raw'
import experienceYaml from '../content/experience.yaml?raw'

const site = YAML.parse(siteYaml)
const papers = YAML.parse(papersYaml)
const education = YAML.parse(educationYaml)
const experience = YAML.parse(experienceYaml)

const app = document.getElementById('app')
const BASE = import.meta.env.BASE_URL

// Resolve the photo referenced in site.yaml from the assets/ folder.
// Any image you drop into assets/ can be picked up by editing `photo` in
// content/site.yaml — no code changes needed.
const photoName = String(site.photo ?? 'me.jpg').replace(/^\/?assets\//, '')
const photoUrls = import.meta.glob('../assets/*.{jpg,jpeg,png,webp}', {
  eager: true,
  query: '?url',
  import: 'default',
})
const photoUrl = photoUrls[`../assets/${photoName}`] ?? Object.values(photoUrls)[0]

/* ---------- helpers ---------- */

const escapeHtml = (s) =>
  String(s ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;')

// Resolve a public/ logo path (svg / png) to a URL
const logo = (name) => `${BASE}logos/${name}`

// Bold authors whose name matches the site owner
const renderAuthors = (authors) =>
  authors
    .map((a) =>
      a.trim() === site.name
        ? `<strong>${escapeHtml(a)}</strong>`
        : escapeHtml(a),
    )
    .join(', ')

/* ---------- sections ---------- */

const sectionHeader = (id, label) => `
  <section class="section" id="${id}">
    <header class="section-head">
      <h2 class="section-title">${escapeHtml(label)}</h2>
      <span class="section-rule" aria-hidden="true"></span>
    </header>
`

const renderNav = () => `
  <nav class="nav">
    <div class="nav-inner">
      <a class="nav-brand" href="#top">${escapeHtml(site.name)}</a>
      <ul class="nav-links">
        ${site.nav
          .map(
            (item) =>
              `<li><a href="${escapeHtml(item.href)}">${escapeHtml(item.label)}</a></li>`,
          )
          .join('')}
      </ul>
    </div>
  </nav>
`

const renderHero = () => `
  <header class="hero" id="top">
    <div class="hero-photo">
      <img src="${photoUrl}" alt="Portrait of ${escapeHtml(site.name)}" />
    </div>
    <div class="hero-text">
      <h1 class="hero-name">${escapeHtml(site.name)}</h1>
      <p class="hero-role">${escapeHtml(site.role)}</p>
      <p class="hero-tagline">${escapeHtml(site.tagline ?? '')}</p>
      <p class="hero-bio">${escapeHtml(site.bio).replaceAll('\n', ' ')}</p>
      <ul class="hero-links">
        ${site.links
          .map(
            (link) => `
            <li>
              <a href="${escapeHtml(link.url)}" target="_blank" rel="noopener" class="icon-link">
                <img src="${logo(link.icon)}" alt="" width="18" height="18" />
                <span>${escapeHtml(link.label)}</span>
              </a>
            </li>`,
          )
          .join('')}
      </ul>
    </div>
  </header>
`

const renderPublications = () => {
  const items = papers.papers
    .map((p) => {
      const links = (p.links ?? [])
        .map(
          (l) => `
            <a class="paper-icon" href="${escapeHtml(l.url)}" target="_blank" rel="noopener" title="${escapeHtml(l.label ?? '')}" aria-label="${escapeHtml(l.label ?? '')}">
              <img src="${logo(l.icon)}" alt="${escapeHtml(l.label ?? '')}" width="18" height="18" />
            </a>`,
        )
        .join('')
      const badge = p.badge
        ? `<span class="badge">${escapeHtml(p.badge)}</span>`
        : ''
      return `
      <article class="paper">
        <div class="paper-main">
          <h3 class="paper-title">${escapeHtml(p.title)}</h3>
          <p class="paper-authors">${renderAuthors(p.authors ?? [])}</p>
          <p class="paper-venue">
            <span class="venue">${escapeHtml(p.venue ?? '')}</span>${badge}
          </p>
        </div>
        <div class="paper-side">${links}</div>
      </article>`
    })
    .join('')
  return `${sectionHeader('publications', 'Publications')}${items}</section>`
}

const renderEducation = () => {
  const items = education.education
    .map((e) => `
      <li class="timeline-item">
        <div class="timeline-dot" aria-hidden="true"></div>
        <div class="timeline-body">
          <h3 class="timeline-title">${escapeHtml(e.degree)}</h3>
          <p class="timeline-school">${escapeHtml(e.school)}</p>
          ${e.note ? `<p class="timeline-note">${escapeHtml(e.note)}</p>` : ''}
        </div>
        <span class="timeline-period">${escapeHtml(e.period)}</span>
      </li>`)
    .join('')
  return `${sectionHeader('education', 'Education')}<ol class="timeline">${items}</ol></section>`
}

const renderExperience = () => {
  const items = experience.experience
    .map((e) => `
      <li class="timeline-item">
        <div class="timeline-dot" aria-hidden="true"></div>
        <div class="timeline-body">
          <h3 class="timeline-title">${escapeHtml(e.company)}</h3>
          ${e.role ? `<p class="timeline-school">${escapeHtml(e.role)}</p>` : ''}
          ${e.summary ? `<p class="timeline-note">${escapeHtml(e.summary)}</p>` : ''}
        </div>
        <span class="timeline-period">${escapeHtml(e.period)}</span>
      </li>`)
    .join('')
  return `${sectionHeader('experience', 'Experience')}<ol class="timeline">${items}</ol></section>`
}

const renderFooter = () => `
  <footer class="footer">
    <p>© ${new Date().getFullYear()} ${escapeHtml(site.name)} · Last updated ${new Date().getFullYear()}</p>
  </footer>
`

/* ---------- mount ---------- */

app.innerHTML = [
  renderNav(),
  `<main class="main">`,
  renderHero(),
  renderPublications(),
  renderEducation(),
  renderExperience(),
  `</main>`,
  renderFooter(),
].join('\n')
