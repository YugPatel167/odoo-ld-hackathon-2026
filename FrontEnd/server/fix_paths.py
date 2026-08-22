import os
import glob

html_dir = r"c:\Users\Yog\Desktop\hackathon\Odoo Hackathon\frontend\html"
files = glob.glob(os.path.join(html_dir, "*.html"))

for file_path in files:
    with open(file_path, "r", encoding="utf-8") as f:
        content = f.read()
    
    # Replace css paths
    content = content.replace('href="css/', 'href="../css/')
    # Replace js paths
    content = content.replace('src="js/', 'src="../js/')
    # Replace image/assets paths (if any)
    content = content.replace('src="assets/', 'src="../assets/')
    
    with open(file_path, "w", encoding="utf-8") as f:
        f.write(content)

print(f"Fixed paths in {len(files)} files.")
