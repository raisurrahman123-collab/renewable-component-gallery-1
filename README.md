# Renewable UI: Component Gallery

রিনিউয়েবল এনার্জি (সোলার, উইন্ড) থিমের UI কম্পোনেন্ট গ্যালারি।

Next.js (App Router) + TypeScript + Tailwind CSS v4. প্রতিটা কম্পোনেন্টের নিজস্ব পেজ: `/components/<slug>`

## লোকালি চালানো
```bash
npm install
npm run dev     # http://localhost:3000
```

## প্রজেক্ট স্ট্রাকচার
```
app/
  page.tsx                   গ্যালারি হোম
  components/[slug]/page.tsx প্রিভিউ + কোড + props টেবিল
  site.ts                    আপনার নাম, GitHub লিংক
components/                  সাইটের নিজস্ব জিনিস (CodeTabs, Spinner)
lib/cn.ts                    className জোড়া লাগানোর হেল্পার
registry/
  index.ts                   সব কম্পোনেন্টের লিস্ট
  types.ts                   GalleryItem, PropDoc টাইপ
  <slug>/
    Component.tsx            আসল কম্পোনেন্ট (props দিয়ে কনফিগারেবল)
    Demo.tsx                 প্রিভিউতে যা দেখাবে (সব state সহ)
    meta.ts                  নাম, বিবরণ, usage, props ডকুমেন্টেশন
```

## নতুন কম্পোনেন্ট যোগ করার চেকলিস্ট
1. `registry/<slug>/` বানান, glass-button ফোল্ডার কপি করে শুরু করতে পারেন
2. কম্পোনেন্টের props এর জন্য `interface` লিখুন, কোনো টেক্সট/রং/সাইজ হার্ডকোড করবেন না
3. প্রযোজ্য state গুলো রাখুন: hover, active, focus-visible, disabled, loading
4. `Demo.tsx`-এ সব state দেখান, মোবাইলে (`flex-wrap`, `sm:` / `md:` ব্রেকপয়েন্ট) চেক করুন
5. `meta.ts`-এ `type`, `week`, `sourceFile`, `usage`, `props` পূরণ করুন (`type` আর Discord পোস্টের Type একই রাখুন)
6. `registry/index.ts`-এ যোগ করুন
7. `git commit -m "feat: add <slug>"` তারপর push

## Deploy (Vercel)
1. github.com এ **public** repo বানান
2. ```bash
   git init && git add . && git commit -m "feat: solar-charge-button and solar-panel-card"
   git branch -M main
   git remote add origin https://github.com/<username>/component-gallery.git
   git push -u origin main
   ```
3. vercel.com → Add New → Project → repo Import → Deploy (কোনো সেটিং বদলাতে হবে না)
