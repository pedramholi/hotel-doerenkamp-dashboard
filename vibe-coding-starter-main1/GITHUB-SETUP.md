# GitHub Setup Guide

## 🎯 Your Repository is Ready!

The Hotel Doerenkamp Dashboard has been committed to git and is ready to push to GitHub.

**Commit**: `c155e62` - Initial commit: Hotel Doerenkamp Dashboard

## 🚀 Push to GitHub

### Step 1: Create a GitHub Repository

1. Go to https://github.com/new
2. Fill in the details:
   - **Repository name**: `hotel-doerenkamp-dashboard`
   - **Description**: `Glassmorphism dashboard for Hotel Doerenkamp - Booking.com analytics`
   - **Visibility**:
     - ⚠️ **Private** (Recommended - contains hotel-specific code)
     - or **Public** (if you want to showcase it)
   - **Do NOT** initialize with README, .gitignore, or license (we already have these)

3. Click "Create repository"

### Step 2: Push Your Code

GitHub will show you commands. Use these:

```bash
# Add the remote repository
git remote add origin https://github.com/YOUR_USERNAME/hotel-doerenkamp-dashboard.git

# Push to GitHub
git branch -M main
git push -u origin main
```

**Or with SSH:**
```bash
git remote add origin git@github.com:YOUR_USERNAME/hotel-doerenkamp-dashboard.git
git branch -M main
git push -u origin main
```

### Step 3: Verify

Visit your repository:
```
https://github.com/YOUR_USERNAME/hotel-doerenkamp-dashboard
```

You should see:
- ✅ README.md with hotel dashboard description
- ✅ All project files
- ✅ Dashboard components and data parsers
- ✅ Documentation files

## 📋 What's Included in the Repository

### Project Files (Committed)
- ✅ Dashboard components (`components/dashboard/`)
- ✅ Data parsers (`lib/bookingcom-parser.ts`, `lib/csv-parser.ts`)
- ✅ Sample data (`data/sample-bookings.json`, `data/sample-bookings.csv`)
- ✅ Documentation (`README.md`, `BOOKING-COM-EXPORT-GUIDE.md`)
- ✅ Configuration files (Tailwind, TypeScript, Next.js)

### Files Excluded (in .gitignore)
- ❌ `node_modules/`
- ❌ `.next/` build directory
- ❌ `.env` files
- ❌ Real booking files (`*.xls`, `*.xlsx`)
- ❌ Sample/demo data IS included for testing

## 🔒 Privacy & Security

Your `.gitignore` is configured to exclude:
```gitignore
# Hotel Doerenkamp - Sensitive booking data
/data/bookings/*.xls
/data/bookings/*.xlsx
/data/bookings/*.csv
*.xls
*.xlsx
```

**✅ Safe to commit:**
- Sample data (anonymized)
- Configuration files
- Code and components
- Documentation

**❌ Never commit:**
- Real Booking.com exports with guest names
- Files with personal information
- API keys or passwords

## 🎨 Repository Settings (Optional)

### Add Topics
Go to **Settings** → Add topics:
- `hotel-management`
- `booking-dashboard`
- `nextjs`
- `typescript`
- `tailwindcss`
- `glassmorphism`
- `booking-com`

### Add Description
```
Beautiful glassmorphism dashboard for Hotel Doerenkamp in Düsseldorf. Visualize Booking.com metrics with CSV/Excel import support.
```

### Add Website
```
https://hotel-doerenkamp-dashboard.vercel.app
```
(After deploying to Vercel)

## 📊 Deploy to Vercel (Recommended)

1. **Install Vercel CLI:**
   ```bash
   npm i -g vercel
   ```

2. **Deploy:**
   ```bash
   vercel
   ```

3. **Follow prompts:**
   - Link to existing project or create new one
   - Set build settings (should auto-detect Next.js)
   - Deploy!

4. **Get URL:**
   ```
   https://hotel-doerenkamp-dashboard.vercel.app
   ```

## 🔄 Future Updates

When you make changes:

```bash
# Stage changes
git add .

# Commit
git commit -m "Add new feature: XYZ"

# Push
git push
```

Vercel will automatically deploy on push to main!

## 📝 Next Steps

1. ✅ Push to GitHub (see above)
2. 🚀 Deploy to Vercel (optional)
3. 🔧 Configure environment variables if needed
4. 📊 Import latest Booking.com data
5. 🎯 Customize for your needs

## 🆘 Troubleshooting

### "Permission denied" error
- Use HTTPS instead of SSH, or
- Set up SSH keys: https://docs.github.com/en/authentication

### "Repository already exists"
- Use a different name, or
- Delete the existing repository first

### Large files warning
- Check if you accidentally committed booking files
- Remove with: `git rm --cached <file>`
- Update `.gitignore` and commit

## 📞 Support

- GitHub Docs: https://docs.github.com
- Vercel Docs: https://vercel.com/docs
- Next.js Docs: https://nextjs.org/docs

---

**Ready to share your hotel dashboard! 🎉**
