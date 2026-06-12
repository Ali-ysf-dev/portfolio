import { GITHUB_CONFIG } from '../config';

const CACHE_KEY = 'gh_repos_cache_v3';
const CACHE_TTL_MS = 60 * 60 * 1000; // 1 hour
const IMAGE_EXT = /\.(png|jpe?g|webp|gif|avif)$/i;

// ─── Cache helpers ────────────────────────────────────────────────────────────

const readCache = () => {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    const { ts, data } = JSON.parse(raw);
    if (Date.now() - ts > CACHE_TTL_MS) {
      localStorage.removeItem(CACHE_KEY);
      return null;
    }
    return data;
  } catch {
    return null;
  }
};

const readStaleCache = () => {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    return JSON.parse(raw).data ?? null;
  } catch {
    return null;
  }
};

const writeCache = (data) => {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify({ ts: Date.now(), data }));
  } catch {
    // storage full or private browsing — silently ignore
  }
};

// ─── Auth headers ─────────────────────────────────────────────────────────────

const getHeaders = () => {
  const headers = { Accept: 'application/vnd.github.v3+json' };
  const token = GITHUB_CONFIG.TOKEN;
  if (token) headers['Authorization'] = `Bearer ${token}`;
  return headers;
};

// ─── Rate-limit check ─────────────────────────────────────────────────────────

const checkRateLimit = (response) => {
  if (response.status !== 403 && response.status !== 429) return { isRateLimited: false, resetAt: null };
  const resetEpoch = response.headers.get('X-RateLimit-Reset');
  const resetAt = resetEpoch ? new Date(Number(resetEpoch) * 1000) : null;
  return { isRateLimited: true, resetAt };
};

// ─── Image URL helpers ────────────────────────────────────────────────────────

const openGraphImage = (repoName) =>
  `https://opengraph.githubassets.com/1/${GITHUB_CONFIG.USERNAME}/${repoName}`;

const rawGitHubImage = (repoName, branch, filename) =>
  `https://raw.githubusercontent.com/${GITHUB_CONFIG.USERNAME}/${repoName}/${branch}/${filename}`;

/** Config override for known repos (no API call). */
const getConfiguredCover = (repoName, branch) => {
  const filename = GITHUB_CONFIG.PROJECT_COVERS?.[repoName];
  if (!filename) return null;
  return rawGitHubImage(repoName, branch, filename);
};

/**
 * Finds the first image file in a repo root via GitHub Contents API.
 * Uses auth token when available (counts toward API limit, cached for 1 h).
 */
const findRootCoverFromApi = async (repoName) => {
  try {
    const url = `${GITHUB_CONFIG.API_URL}/repos/${GITHUB_CONFIG.USERNAME}/${repoName}/contents`;
    const response = await fetch(url, { headers: getHeaders() });
    if (!response.ok) return null;

    const contents = await response.json();
    if (!Array.isArray(contents)) return null;

    const imageFile = contents.find(
      (file) => file.type === 'file' && IMAGE_EXT.test(file.name)
    );

    if (imageFile?.download_url) return imageFile.download_url;
    if (imageFile?.name) {
      const branch = imageFile.path?.split('/')[0] || 'main';
      return rawGitHubImage(repoName, branch, imageFile.name);
    }
    return null;
  } catch {
    return null;
  }
};

/** Resolve cover: config → API root scan → opengraph fallback. */
const resolveCoverImage = async (repo) => {
  const branch = repo.default_branch || 'main';
  const configured = getConfiguredCover(repo.name, branch);
  if (configured) return configured;

  const fromApi = await findRootCoverFromApi(repo.name);
  if (fromApi) return fromApi;

  return openGraphImage(repo.name);
};

// ─── Transform a raw GitHub repo object ───────────────────────────────────────

const transformRepo = (repo, imageUrl) => ({
  id: repo.id,
  title: repo.name,
  shortDescription: repo.description || 'No description available',
  image: imageUrl,
  imageFallback: openGraphImage(repo.name),
  tags: [
    ...(repo.language ? [repo.language.toLowerCase()] : []),
    ...(repo.topics || []).slice(0, 3),
  ],
  featured: repo.stargazers_count > 0,
  liveUrl: repo.homepage || null,
  codeUrl: repo.html_url,
  stars: repo.stargazers_count,
  forks: repo.forks_count,
  updatedAt: repo.updated_at,
  language: repo.language,
  isFork: repo.fork,
});

// ─── Public API ───────────────────────────────────────────────────────────────

/**
 * Fetches repositories from GitHub, with localStorage caching.
 * Cover images are read from each repo's root directory.
 */
export const fetchGitHubRepos = async (limit = 10, sort = 'updated') => {
  const cached = readCache();
  if (cached) return cached;

  try {
    const url = `${GITHUB_CONFIG.API_URL}/users/${GITHUB_CONFIG.USERNAME}/repos?sort=${sort}&per_page=${limit}&type=all`;
    const response = await fetch(url, { headers: getHeaders() });

    const { isRateLimited, resetAt } = checkRateLimit(response);
    if (isRateLimited) {
      const msg = resetAt
        ? `GitHub rate limit exceeded. Resets at ${resetAt.toLocaleTimeString()}.`
        : 'GitHub rate limit exceeded.';
      console.warn(msg);
      return readStaleCache() ?? [];
    }

    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.status}`);
    }

    const repos = await response.json();

    const result = await Promise.all(
      repos.map(async (repo) => {
        const imageUrl = await resolveCoverImage(repo);
        return transformRepo(repo, imageUrl);
      })
    );

    writeCache(result);
    return result;
  } catch (error) {
    console.error('Failed to fetch GitHub repos:', error);
    return readStaleCache() ?? [];
  }
};
