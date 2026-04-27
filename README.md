# Instructions

### What’s included in this repository?

This repository contains an Angular application with the following structure:

- The domain simulates a **UlysesSuite Infrastructure Dashboard** with three main views: a Server Heatmap, an Auto-Scaling Policy builder, and a Server Metrics viewer.
- The application uses **Angular 20+** with Standalone Components, **RxJS**, **Signals**, and **TailwindCSS**.
- It includes a data generation script (`seed.js`) that creates a massive dataset of **500 servers and 60 days** of historical data (approximately 30,000 heavy records).
- It uses a **Node.js mock backend (`json-server`)** that serves this data.
- The API is intentionally configured with a **2.5-second network delay** to simulate real-world latency.

---

## Project Setup

The project uses a mock backend to simulate real-world API conditions.

1.  **Install dependencies**: `npm install`
2.  **Generate heavy dataset**: `npm run seed` (This generates ~30,000 high-payload records in `db.json`)
3.  **Start Mock API**: `npm run api` (Runs on port 3000 with a mandatory 2.5s network delay)
4.  **Start Angular App**: `npm start`

---

### What do you need to implement?

1. **Optimize the Grid (`ServerHeatmapComponent`):**
   - The current implementation freezes the browser rdue to DOM overload and poor change detection.
   - Remove any method calls (like `getMetricsForSever()`) directly from the HTML template's `@for` loop.
   - Implement `ChangeDetectionStrategy.OnPush`.
   - Pre-process the flat data into an optimized 2D structure (Map/Dictionary) in the component class to achieve **O(1)** rendering reads.
   - Handle the massive amount of DOM nodes efficiently whit angular capatibilitys.

2. **Build the Auto-Scaling Engine (`AutoScalingFormComponent`):**
   - The current form is static, incomplete, and untyped.
   - Implement a strictly typed reactive `FormGroup` that adheres entirely to the `ScalingPolicy` interface located in `src/app/models/scaling-policy.model.ts`.
   - Implement a `FormArray` to allow users to add and remove dynamic rules.
   - Use **Angular Signals** to calculate and display the "Estimated Cost" in real-time as the user interacts with the form, based on the provided `INSTANCE_PRICES` constant.

3. **Refactor Networking & Caching (`ServerMetricsComponent`):**
   - The component currently injects `HttpClient` directly, causing race conditions and memory leaks.
   - Decouple the data fetching logic into a dedicated **Service**.
   - Implement a **Caching System** (using RxJS like `shareReplay`, Maps, or Signals):
     - Check if the server data exists in the cache.
     - If it does not exist, call the API (and wait the 2.5s delay).
     - If the user returns to a previously visited server, it must load instantly from the cache.
   - Prevent **Race Conditions**: If the user clicks multiple servers rapidly, use appropriate RxJS operators (like `switchMap`) to cancel obsolete requests.
   - Ensure clean subscription management (e.g., using the `async` pipe, `toSignal`, or `takeUntilDestroyed`).

---

### Additional Information

- You must use **Angular 20+** features (Standalone components, new control flow).
- **Strict typing is mandatory** — do not use `any` types.
- **Do not use any external state management libraries** (like NgRx, Akita, etc.) — all reactivity and caching must be implemented natively by you using RxJS and Signals.
- If there’s something you’re not sure how to do, don’t worry — just give it your best effort.
- We will carefully review your code and provide feedback as soon as possible.
