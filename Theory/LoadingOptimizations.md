- Asset loading optimizations like preload and preinit (preconnect / prefetch) help the browser load critical resources earlier and more efficiently, reducing render-blocking, time to first paint, and Largest Contentful Paint (LCP). They tell the browser what to load and when, instead of letting it guess. Without hints, the browser must parse HTML, CSS, and JavaScript before it knows which resources are needed. Resource hints allow developers to tell the browser:
  1. what resources will be needed
  2. how important they are
  3. when they will be needed
  4. whether connections should be established in advance

Benefits:
  1. Faster First Contentful Paint (FCP)
  2. Faster Largest Contentful Paint (LCP)
  3. Reduced render-blocking
  4. Better user-perceived performance
  5. Reduced network latency

---

- preload - Loads a resource early and gives it high priority. Use this for critical resources for the current page that should be loaded with the highest priority.
  Typical use cases:
    1. fonts - Reduces font loading delays and layout shifts.
    2. hero images (LCP image) - One of the highest-impact preload candidates.
    3. critical css
    4. important scripts.
  Common mistake: Preloading too many resources. Everything cannot be high priority. Excessive preloads compete with truly critical assets.

---

- preinit - Downloads and initializes a resource immediately. While preload only downloads the file, preinit goes a step further. It tells the browser to download and prepare the resource for use (download + initialization).
  For scripts this means:
    1. Download script
    2. Parse script
    3. Prepare execution
  When the script is later needed, much less work remains.
  Good use cases:
    1. Analytics libraries
    2. Critical third-party SDKs
    3. Scripts required immediately after page load

---

- prefetch - Downloads resources that may be needed in the future. Load resource for future navigation. Low priority. Browser downloads it when idle.
  Typical use cases: pages user may navigate to (/movies).
  Good candidates:
    1. Next route
    2. Product detail pages
    3. Search results
    4. Frequently visited pages
  Prefetch is a hint only. The browser may completely ignore it depending on:
    1. network conditions
    2. device memory
  Common mistake: Using prefetch for assets needed on the current page. Use preload instead.

---

- preconnect - establishes a connection to a server. Good for third-party resources, Google Fonts very common.
  The browser performs:
    1. DNS lookup
    2. TCP handshake
    3. TLS negotiation
    before the actual request happens.
    Best use cases:
      1. Google Fonts
      2. Analytics providers
      3. CDNs
      4. Payment providers
      5. Third-party APIs
    Each preconnect consumes resources. Generally only use it for domains that will definitely be contacted.

---

- dns-prefetch - Performs only DNS resolution. Use case: Many third-party domains that might be used later.

---

- fetchpriority - Controls how important a resource is relative to other resources being downloaded. Unlike preload, which helps the browser discover a resource earlier, fetchpriority changes the priority of a resource that the browser already knows about. Think of it as: preload = discover earlier, fetchpriority = prioritize differently.
  values:
    1. high - Download sooner than normal
    2. auto - Browser decides (default)
    3. low - Download later than normal

    High priority:
      1. LCP (Largest Contentful Paint) image
      2. Above-the-fold images
      3. Critical assets visible immediately

    Common mistake: Marking every image as high priority.
    If everything is high priority, nothing is high priority.

---

- Finalizing:
  1. preload resources needed for the current page (I need this resource for THIS page).
  2. prefetch resources needed for future pages (I may need this resource for a FUTURE page).
  3. preconnect to critical third-party domains.
  4. dns-prefetch when you want a cheaper alternative to preconnect.
  5. Don't preload everything.
  6. Preload your LCP image whenever possible.
  7. fetchpriority does not replace preload; they solve different problems.
  8. If everything is high priority, nothing is high priority