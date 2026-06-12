// EmailJS Configuration
export const EMAILJS_CONFIG = {
    PUBLIC_KEY: "NirhiVPX-fKbRk_gz",
    SERVICE_ID: "service_i27vanr",
    TEMPLATE_ID: "template_ce3m214",
    CONTACT_EMAIL: "contact@aliyoussef.tech"
};

// GitHub Configuration
// To raise the rate limit from 60 → 5 000 req/h, create a fine-grained
// Personal Access Token (read-only, public repos) at:
//   https://github.com/settings/tokens?type=beta
// then add  VITE_GITHUB_TOKEN=ghp_...  to your .env file.
export const GITHUB_CONFIG = {
    USERNAME: "Ali-ysf-dev",
    API_URL: "https://api.github.com",
    TOKEN: import.meta.env.VITE_GITHUB_TOKEN || null,
    // Cover image filename in each repo root (raw.githubusercontent.com — no extra API call)
    // Repos not listed here are auto-detected from the root via the Contents API.
    PROJECT_COVERS: {
        "firdaus": "project.png",
        "apple-watch": "portrait.png",
        "allari": "allari_mockup.png",
        "Payrot": "payrot.png",
        "Warehouse": "ware_mockup.png",
        "medika": "medika_mockup.png",
    },
};

