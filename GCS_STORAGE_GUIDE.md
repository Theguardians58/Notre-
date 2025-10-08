# 📦 Google Cloud Storage Integration Guide

**Upload media files to your own Google Cloud Storage bucket!**

---

## 🎯 Overview

CogniNote now supports uploading media files directly to your **Google Cloud Storage** bucket, giving you:

✅ **Full Control** - Complete ownership of your files  
✅ **Lower Costs** - GCS pricing for large files  
✅ **Global CDN** - Fast delivery worldwide  
✅ **Advanced Features** - Versioning, lifecycle policies, etc.  
✅ **Privacy** - Your data stays in your GCP project  

---

## 🚀 Quick Setup (5 Minutes)

### Step 1: Create GCS Bucket

```bash
# Using gcloud CLI
gcloud storage buckets create gs://my-cogninote-bucket \
    --location=US \
    --uniform-bucket-level-access

# Or use Google Cloud Console
# https://console.cloud.google.com/storage
```

### Step 2: Create Service Account

```bash
# Create service account
gcloud iam service-accounts create cogninote-storage \
    --display-name="CogniNote Storage"

# Grant permissions
gcloud projects add-iam-policy-binding YOUR_PROJECT_ID \
    --member="serviceAccount:cogninote-storage@YOUR_PROJECT_ID.iam.gserviceaccount.com" \
    --role="roles/storage.objectAdmin"

# Create key
gcloud iam service-accounts keys create ~/cogninote-key.json \
    --iam-account=cogninote-storage@YOUR_PROJECT_ID.iam.gserviceaccount.com
```

### Step 3: Configure in CogniNote

1. Go to **Settings** → **Storage**
2. Enter your **Project ID**
3. Enter your **Bucket Name**
4. Paste **Service Account JSON** key
5. Click **Save Configuration**
6. Test connection!

---

## 📖 Detailed Setup

### Prerequisites

- Google Cloud Platform account
- GCP project created
- Billing enabled (free tier available)
- `gcloud` CLI installed (optional)

### 1. Create Google Cloud Storage Bucket

#### Using Google Cloud Console:

1. Go to https://console.cloud.google.com/storage
2. Click **Create Bucket**
3. Enter bucket name: `my-cogninote-bucket`
4. Choose **Location**: 
   - **Multi-region** for global access (recommended)
   - **Single region** for specific location
5. **Storage class**: Standard
6. **Access control**: 
   - Choose "Uniform" (recommended)
   - Or "Fine-grained" for more control
7. **Public access**: 
   - Keep prevention ON for private files
   - Or disable for public files
8. Click **Create**

#### Using gcloud CLI:

```bash
# Set project
gcloud config set project YOUR_PROJECT_ID

# Create bucket
gsutil mb -l US gs://my-cogninote-bucket

# Set uniform access
gsutil uniformbucketlevelaccess set on gs://my-cogninote-bucket

# Make bucket public (optional)
gsutil iam ch allUsers:objectViewer gs://my-cogninote-bucket
```

### 2. Create Service Account

#### Why Service Account?

Service accounts provide:
- Secure authentication
- Programmatic access
- Fine-grained permissions
- No password management

#### Create Service Account:

**Console Method:**

1. Go to https://console.cloud.google.com/iam-admin/serviceaccounts
2. Click **Create Service Account**
3. Name: `cogninote-storage`
4. Description: "CogniNote media storage access"
5. Click **Create and Continue**
6. Grant role: **Storage Object Admin**
7. Click **Continue** → **Done**

**CLI Method:**

```bash
gcloud iam service-accounts create cogninote-storage \
    --description="CogniNote storage" \
    --display-name="CogniNote Storage"
```

#### Assign Permissions:

```bash
# Storage Object Admin (full control)
gcloud projects add-iam-policy-binding YOUR_PROJECT_ID \
    --member="serviceAccount:cogninote-storage@YOUR_PROJECT_ID.iam.gserviceaccount.com" \
    --role="roles/storage.objectAdmin"

# Or Storage Object Creator (upload only)
gcloud projects add-iam-policy-binding YOUR_PROJECT_ID \
    --member="serviceAccount:cogninote-storage@YOUR_PROJECT_ID.iam.gserviceaccount.com" \
    --role="roles/storage.objectCreator"
```

#### Create JSON Key:

**Console Method:**

1. Click on your service account
2. Go to **Keys** tab
3. Click **Add Key** → **Create new key**
4. Choose **JSON** format
5. Click **Create**
6. Save the downloaded JSON file

**CLI Method:**

```bash
gcloud iam service-accounts keys create ~/cogninote-key.json \
    --iam-account=cogninote-storage@YOUR_PROJECT_ID.iam.gserviceaccount.com
```

### 3. Configure CogniNote

#### In Application:

1. Navigate to **Settings** → **Storage**
2. Fill in details:
   - **Project ID**: Your GCP project ID (e.g., `my-project-123456`)
   - **Bucket Name**: Your bucket name (e.g., `my-cogninote-bucket`)
   - **Credentials**: Paste entire JSON key content
3. Click **Save Configuration**
4. Click **Test Connection** to verify

#### Example Credentials JSON:

```json
{
  "type": "service_account",
  "project_id": "your-project-id",
  "private_key_id": "abc123...",
  "private_key": "-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n",
  "client_email": "cogninote-storage@your-project.iam.gserviceaccount.com",
  "client_id": "123456789...",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token",
  "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
  "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/..."
}
```

---

## 🎨 Usage

### Upload Files

1. Go to any note
2. Click **Upload Media**
3. Select **Google Cloud Storage** (if configured)
4. Choose file
5. Upload!

Files are uploaded to: `gs://your-bucket/filename`

### Access Files

Uploaded files get a public URL:
```
https://storage.googleapis.com/your-bucket/filename
```

Or use signed URLs for private access:
```
https://storage.googleapis.com/your-bucket/filename?X-Goog-Signature=...
```

### Organize Files

Files can be organized in folders:
```
gs://your-bucket/images/photo.jpg
gs://your-bucket/videos/clip.mp4
gs://your-bucket/documents/doc.pdf
```

---

## 🔐 Security

### Public vs Private Buckets

**Public Bucket:**
```bash
# Anyone can view files
gsutil iam ch allUsers:objectViewer gs://your-bucket
```

**Private Bucket:**
```bash
# Only authenticated users
gsutil iam ch -d allUsers:objectViewer gs://your-bucket
```

### Signed URLs

For private files, generate signed URLs:

```typescript
import { getSignedUrl } from '@/lib/storage/google-cloud-storage';

const url = await getSignedUrl(
  storage,
  'my-bucket',
  'private-file.pdf',
  60 // expires in 60 minutes
);
```

### Best Practices

✅ Use service accounts (not user accounts)  
✅ Grant minimum required permissions  
✅ Rotate keys regularly  
✅ Keep credentials secure (never commit to git)  
✅ Use signed URLs for sensitive files  
✅ Enable versioning for important files  
✅ Set lifecycle policies to manage costs  

---

## 💰 Costs

### GCS Pricing (US Multi-Region)

**Storage:**
- Standard: $0.026 per GB/month
- Nearline: $0.010 per GB/month (30-day min)
- Coldline: $0.004 per GB/month (90-day min)

**Network:**
- Upload: FREE
- Download (0-1 TB): $0.12 per GB
- Download (1-10 TB): $0.11 per GB

**Operations:**
- Class A (write): $0.05 per 10,000 operations
- Class B (read): $0.004 per 10,000 operations

### Example Costs:

**Light User** (10 GB storage, 100 GB transfer/month):
```
Storage:  10 GB × $0.026  = $0.26
Transfer: 100 GB × $0.12  = $12.00
Total:    ~$12.26/month
```

**Heavy User** (100 GB storage, 1 TB transfer/month):
```
Storage:  100 GB × $0.026  = $2.60
Transfer: 1 TB × $0.12     = $122.40
Total:    ~$125/month
```

**Free Tier:**
- 5 GB storage/month (Regional)
- 5,000 Class A operations/month
- 50,000 Class B operations/month
- 1 GB egress/month

---

## ⚙️ Advanced Features

### Lifecycle Policies

Auto-delete old files:

```bash
# lifecycle.json
{
  "lifecycle": {
    "rule": [
      {
        "action": {"type": "Delete"},
        "condition": {"age": 30}
      }
    ]
  }
}

# Apply policy
gsutil lifecycle set lifecycle.json gs://your-bucket
```

### Versioning

Enable file versioning:

```bash
gsutil versioning set on gs://your-bucket
```

### CORS Configuration

Allow browser uploads:

```json
[
  {
    "origin": ["https://your-domain.com"],
    "method": ["GET", "POST", "PUT"],
    "responseHeader": ["Content-Type"],
    "maxAgeSeconds": 3600
  }
]
```

```bash
gsutil cors set cors.json gs://your-bucket
```

### CDN Integration

Enable Cloud CDN for faster delivery:

```bash
gcloud compute backend-buckets create cogninote-cdn \
    --gcs-bucket-name=your-bucket \
    --enable-cdn
```

---

## 🔄 Migration

### From Firebase Storage

```typescript
// Export from Firebase
const files = await listFirebaseFiles();

for (const file of files) {
  const data = await downloadFromFirebase(file.url);
  await uploadToGCS(storage, bucket, data, file.name);
}
```

### From Appwrite Storage

```typescript
// Export from Appwrite
const files = await appwrite.storage.listFiles(bucketId);

for (const file of files.files) {
  const data = await appwrite.storage.getFileDownload(bucketId, file.$id);
  await uploadToGCS(storage, bucket, data, file.name);
}
```

---

## 🐛 Troubleshooting

### Issue: "Permission Denied"

**Solution:**
- Check service account has `roles/storage.objectAdmin`
- Verify credentials JSON is correct
- Ensure bucket exists

### Issue: "Bucket not found"

**Solution:**
- Verify bucket name (no `gs://` prefix)
- Check project ID matches
- Confirm bucket exists: `gsutil ls`

### Issue: "Invalid credentials"

**Solution:**
- Re-download JSON key
- Check JSON is valid (no formatting errors)
- Verify service account is active

### Issue: "Upload fails"

**Solution:**
- Check file size limits
- Verify network connection
- Check bucket has enough quota
- Review service account permissions

---

## 📊 Monitoring

### View Usage:

```bash
# Bucket size
gsutil du -s gs://your-bucket

# List files
gsutil ls -l gs://your-bucket

# Storage class distribution
gsutil stat gs://your-bucket/**
```

### Cloud Console:

1. Go to https://console.cloud.google.com/storage
2. Click on your bucket
3. View:
   - Storage usage
   - Requests
   - Network egress
   - Costs

---

## 🎯 Best Practices

### Organization

```
gs://your-bucket/
  ├── images/
  │   ├── profiles/
  │   └── notes/
  ├── videos/
  ├── documents/
  └── backups/
```

### Naming Convention

```
{timestamp}-{user-id}-{original-filename}
1699500000-user123-photo.jpg
```

### File Management

- Set lifecycle policies
- Enable versioning
- Use object metadata
- Implement access logs
- Regular backups

---

## 🔗 Resources

### Documentation
- [GCS Documentation](https://cloud.google.com/storage/docs)
- [Service Accounts](https://cloud.google.com/iam/docs/service-accounts)
- [Pricing Calculator](https://cloud.google.com/products/calculator)

### Tools
- [Google Cloud Console](https://console.cloud.google.com)
- [gcloud CLI](https://cloud.google.com/sdk/gcloud)
- [gsutil](https://cloud.google.com/storage/docs/gsutil)

### Support
- [Stack Overflow](https://stackoverflow.com/questions/tagged/google-cloud-storage)
- [Google Cloud Support](https://cloud.google.com/support)

---

## ✅ Summary

With Google Cloud Storage integration:

✅ Upload files to your own bucket  
✅ Full control over media storage  
✅ Lower costs for large files  
✅ Global CDN for fast delivery  
✅ Advanced GCS features available  
✅ Privacy and data sovereignty  
✅ Easy migration path  

**Configure now in Settings → Storage!** 🚀
