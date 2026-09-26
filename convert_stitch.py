import os
import re

def convert_html_to_jsx(html_content):
    # Extract body content
    body_match = re.search(r'<body[^>]*>(.*)</body>', html_content, re.DOTALL | re.IGNORECASE)
    if body_match:
        jsx = body_match.group(1)
    else:
        jsx = html_content
    
    # Replace class with className
    jsx = re.sub(r'\bclass=', 'className=', jsx)
    
    # Replace for with htmlFor
    jsx = re.sub(r'\bfor=', 'htmlFor=', jsx)
    
    # Self-close specific tags
    tags_to_close = ['input', 'img', 'br', 'hr', 'source']
    for tag in tags_to_close:
        # Regex to find unclosed tags and close them
        # Matches <tag ... > where it doesn't end with />
        pattern = re.compile(rf'<{tag}([^>]*?)(?<!/)>', re.IGNORECASE)
        jsx = pattern.sub(rf'<{tag}\1 />', jsx)
        
    # Fix inline styles (very basic, mostly just removing them if they cause issues, or leaving them if simple)
    # Actually, inline styles like style="width: 100%" -> style={{ width: '100%' }}
    # For now, just replace style="..." with nothing to avoid React errors, or fix it manually if needed.
    # Stitch usually uses Tailwind, so inline styles might be rare.
    # Let's just find them and print them to see if we need to handle them.
    styles = re.findall(r'style="([^"]*)"', jsx)
    if styles:
        print(f"Found inline styles: {styles}")
        # Convert simple styles
        def style_replacer(match):
            style_str = match.group(1)
            # basic parsing: 'background-image: url(...)'
            # Let's just remove them for now to ensure it compiles, we can fix later if critical
            return 'style={{}}'
        jsx = re.sub(r'style="([^"]*)"', style_replacer, jsx)
        
    # Replace HTML comments with JSX comments
    jsx = re.sub(r'<!--(.*?)-->', r'{/* \1 */}', jsx, flags=re.DOTALL)
    
    # SVG attributes like stroke-linecap, stroke-width, fill-rule need camelCase
    replacements = {
        'stroke-linecap': 'strokeLinecap',
        'stroke-linejoin': 'strokeLinejoin',
        'stroke-width': 'strokeWidth',
        'fill-rule': 'fillRule',
        'clip-rule': 'clipRule',
        'clip-path': 'clipPath',
        'viewbox': 'viewBox',
        'xml:space': 'xmlSpace'
    }
    for old, new in replacements.items():
        jsx = re.sub(rf'\b{old}=', f'{new}=', jsx)
        
    # Remove tabindex if it's tabindex="0" just make it tabIndex
    jsx = re.sub(r'\btabindex=', 'tabIndex=', jsx)
    
    # Replace checked="" with defaultChecked
    jsx = re.sub(r'\bchecked=""', 'defaultChecked', jsx)
    
    return jsx

def main():
    files = [
        "dashboard.html",
        "services.html",
        "aichat.html",
        "vault.html",
        "wallet.html"
    ]
    
    for filename in files:
        path = os.path.join("stitch_screens", filename)
        if not os.path.exists(path):
            continue
            
        with open(path, 'r', encoding='utf-8') as f:
            html = f.read()
            
        jsx = convert_html_to_jsx(html)
        
        # Create a basic functional component
        comp_name = filename.split('.')[0].capitalize() + "View"
        component_code = f"""
import React from 'react';
import Link from 'next/link';

export default function {comp_name}() {{
  return (
    <>
      {jsx}
    </>
  );
}}
"""
        out_path = os.path.join("stitch_screens", f"{comp_name}.tsx")
        with open(out_path, 'w', encoding='utf-8') as f:
            f.write(component_code)
        print(f"Generated {out_path}")

if __name__ == "__main__":
    main()
