import os
import glob

html_dir = r"c:\Users\Yog\Desktop\hackathon\Odoo Hackathon\frontend\html"
files = glob.glob(os.path.join(html_dir, "*.html"))

feedback_link = '        <li><a href="feedback.html"><svg viewBox="0 0 24 24"><path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z"/></svg>Feedback</a></li>\n'
contact_link = '<li><a href="contact.html"><svg viewBox="0 0 24 24"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 7l9 6 9-6"/></svg>Contact</a></li>'

for file_path in files:
    with open(file_path, "r", encoding="utf-8") as f:
        content = f.read()
    
    # Check if feedback is already in the file to avoid duplicates
    if "feedback.html" not in content and contact_link in content:
        content = content.replace(contact_link, contact_link + "\n" + feedback_link)
        
        with open(file_path, "w", encoding="utf-8") as f:
            f.write(content)
            print(f"Added feedback link to {os.path.basename(file_path)}")
