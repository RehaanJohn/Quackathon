"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BlockedScrapeError = void 0;
exports.validateScrapeResult = validateScrapeResult;
class BlockedScrapeError extends Error {
    reason;
    detectedIssue;
    finalUrl;
    constructor(reason, detectedIssue, finalUrl) {
        super(reason);
        this.reason = reason;
        this.detectedIssue = detectedIssue;
        this.finalUrl = finalUrl;
        this.name = 'BlockedScrapeError';
    }
}
exports.BlockedScrapeError = BlockedScrapeError;
function validateScrapeResult(result) {
    const { requestedUrl, finalUrl, statusCode, markdown = '', html = '', metadata = {} } = result;
    // 3. URL Redirect Detection
    if (finalUrl) {
        const redirectKeywords = [
            "/login", "/signin", "/signup", "/register", "/auth",
            "/identifier", "/oauth", "/sso", "/account/login"
        ];
        const finalUrlLower = finalUrl.toLowerCase();
        for (const keyword of redirectKeywords) {
            if (finalUrlLower.includes(keyword)) {
                throw new BlockedScrapeError("Authentication required", "Redirected to login page", finalUrl);
            }
        }
    }
    const contentToInspect = `${metadata.title || ''} ${markdown} ${html}`.toLowerCase();
    // 5. Cloudflare Detection
    const cloudflareKeywords = [
        "verify you are human",
        "checking your browser",
        "cloudflare",
        "captcha",
        "security check",
        "browser verification"
    ];
    for (const keyword of cloudflareKeywords) {
        if (contentToInspect.includes(keyword)) {
            throw new BlockedScrapeError("Protected by verification", "Cloudflare or bot protection detected", finalUrl);
        }
    }
    // 6. Access Restriction Detection
    if (statusCode === 401 || statusCode === 403) {
        throw new BlockedScrapeError("Access restricted", "Protected content detected", finalUrl);
    }
    const accessRestrictionKeywords = [
        "access denied",
        "forbidden",
        "unauthorized",
        "protected content"
    ];
    for (const keyword of accessRestrictionKeywords) {
        if (contentToInspect.includes(keyword)) {
            throw new BlockedScrapeError("Access restricted", "Protected content detected", finalUrl);
        }
    }
    // 4 & 7. Authentication Content & Scrape Quality Detection
    const authKeywords = [
        "login",
        "log in",
        "sign in",
        "sign up",
        "register",
        "authentication",
        "verify identity",
        "continue with google",
        "continue with microsoft",
        "forgot password",
        "enter your email"
    ];
    let authKeywordCount = 0;
    for (const keyword of authKeywords) {
        // Count occurrences of each keyword
        const regex = new RegExp(keyword, 'g');
        const matches = contentToInspect.match(regex);
        if (matches) {
            authKeywordCount += matches.length;
        }
    }
    console.log("[VALIDATOR] Auth keyword count:", authKeywordCount);
}
