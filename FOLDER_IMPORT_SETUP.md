# Folder Import Setup Guide

## Expected Folder Structure

The import script expects your project data to be organized like this:

```
project-data/
├── project-1/
│   ├── info.txt (or project.txt, README.md)
│   ├── before/
│   │   ├── image1.jpg
│   │   ├── image2.jpg
│   │   └── ...
│   ├── after/
│   │   ├── image1.jpg
│   │   ├── image2.jpg
│   │   └── ...
│   └── gallery/ (optional - other images)
│       ├── image1.jpg
│       └── ...
├── project-2/
│   ├── info.txt
│   ├── before/
│   └── after/
└── ...
```

## Info File Format

The `info.txt` file should contain project details in this format:

```
Title: Vesterbro Apartment
Year: 2024
Summary: Modern renovation of a classic Copenhagen apartment
Location: Vesterbro, Copenhagen
Size: 95 sqm
Rooms: 3
Duration: 4 months

Content:
This stunning apartment in Vesterbro combines modern design with classic Copenhagen architecture.

The project focused on creating an open, light-filled space while preserving the building's historical character...
```

## Alternative Formats Supported

### JSON Format (info.json):
```json
{
  "title": "Vesterbro Apartment",
  "year": 2024,
  "summary": "Modern renovation of a classic Copenhagen apartment",
  "facts": {
    "Location": "Vesterbro, Copenhagen",
    "Size": "95 sqm",
    "Rooms": "3",
    "Duration": "4 months"
  },
  "content": "Full project description..."
}
```

## Questions to Customize the Import Script

1. **Where is your project data folder?** 
   - Example: `/Users/jesper/Desktop/project-data`

2. **What is your folder structure?**
   - Option A: `project-name/before/` and `project-name/after/`
   - Option B: `project-name/images/before/` and `project-name/images/after/`
   - Option C: Custom structure

3. **What format are your info files?**
   - `.txt` files
   - `.json` files
   - `.md` (markdown) files
   - Other format

4. **How are before/after images matched?**
   - Same filenames (e.g., `kitchen.jpg` in both folders)
   - Sequential order (1.jpg, 2.jpg, etc.)
   - Custom matching

Please provide these details and I'll create a custom import script for your exact structure!
