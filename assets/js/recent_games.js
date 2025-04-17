async function loadGammes() {
  let json1 = await fetchJson("/data-json/auth1.json");
  let json2 = await fetchJson("/data-json/auth2.json");
  if (!json1 || !json2) {
    document.body.innerHTML = "";
    return;
  }
  let domain = window.location.origin.replace(/https?:\/\//, "");
  let hashBuffer = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(json1.text + json2.text + domain));
  let hashArray = Array.from(new Uint8Array(hashBuffer));
  let expectedHash = hashArray
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("")
    .substring(0, 16);
  let validHashes = await fetchJson("/data-json/validHashes.json");

  // Remove the redirection logic
  if (!validHashes.includes(expectedHash)) {
    console.warn("Invalid hash detected, but redirection has been disabled.");
    return; // Stop further execution without redirecting
  }
}