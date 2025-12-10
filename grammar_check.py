import re
import os

def check_grammar_issues(file_path):
    """Check for common grammar and content issues in HTML files"""
    issues = []
    
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Extract text content from HTML (simple approach)
    # Remove script and style tags
    content = re.sub(r'<script[^>]*>.*?</script[^>]*>', '', content, flags=re.DOTALL | re.IGNORECASE)
    content = re.sub(r'<style[^>]*>.*?</style[^>]*>', '', content, flags=re.DOTALL | re.IGNORECASE)
    
    # Extract text between tags
    text_content = re.sub(r'<[^>]+>', ' ', content)
    text_content = re.sub(r'\s+', ' ', text_content).strip()
    
    lines = content.split('\n')
    
    for i, line in enumerate(lines, 1):
        # Skip lines that are mostly HTML tags
        if re.match(r'^\s*<[^>]+>\s*$', line):
            continue
            
        # Check for common grammar issues
        
        # Double spaces
        if '  ' in line and not re.search(r'<pre', line):
            issues.append(f"Line {i}: Double spaces found")
        
        # Missing punctuation at end of sentences (in paragraph tags)
        if re.search(r'<p[^>]*>[^<]*[a-z]\s*</p>', line, re.IGNORECASE):
            if not re.search(r'[.!?]\s*</p>', line):
                issues.append(f"Line {i}: Possible missing punctuation at end of paragraph")
        
        # Inconsistent capitalization in titles
        if re.search(r'<h[1-6][^>]*>.*?</h[1-6]>', line):
            title = re.search(r'<h[1-6][^>]*>(.*?)</h[1-6]>', line)
            if title:
                title_text = title.group(1)
                # Check if it's all lowercase (might be intentional for brand)
                if title_text and title_text[0].islower() and 'hlpfl' not in title_text.lower():
                    issues.append(f"Line {i}: Title might need capitalization: '{title_text}'")
        
        # Common typos
        typos = {
            r'\bthe the\b': 'the the',
            r'\ban an\b': 'an an',
            r'\ba a\b': 'a a',
            r'\byour your\b': 'your your',
            r'\band and\b': 'and and',
        }
        
        for pattern, desc in typos.items():
            if re.search(pattern, line, re.IGNORECASE):
                issues.append(f"Line {i}: Possible duplicate word: '{desc}'")
        
        # Check for common spelling mistakes in visible text
        common_mistakes = {
            r'\brecieve\b': 'receive',
            r'\boccured\b': 'occurred',
            r'\bseperate\b': 'separate',
            r'\bdefinately\b': 'definitely',
        }
        
        for pattern, correction in common_mistakes.items():
            if re.search(pattern, line, re.IGNORECASE):
                issues.append(f"Line {i}: Possible spelling error - should be '{correction}'")
    
    return issues

def main():
    html_files = [
        'index.html',
        'about.html',
        'services.html',
        'shop.html',
        'vip.html',
        'red-flag-guide.html',
        'under-construction.html'
    ]
    
    print("=" * 80)
    print("GRAMMAR AND CONTENT CHECK REPORT")
    print("=" * 80)
    print()
    
    all_issues = {}
    
    for html_file in html_files:
        if os.path.exists(html_file):
            print(f"\nChecking {html_file}...")
            issues = check_grammar_issues(html_file)
            
            if issues:
                all_issues[html_file] = issues
                print(f"  Found {len(issues)} potential issues")
                for issue in issues[:5]:  # Show first 5
                    print(f"    - {issue}")
                if len(issues) > 5:
                    print(f"    ... and {len(issues) - 5} more")
            else:
                print(f"  No obvious issues found")
        else:
            print(f"\n{html_file} not found")
    
    print("\n" + "=" * 80)
    print("SUMMARY")
    print("=" * 80)
    
    if all_issues:
        print(f"\nTotal files with issues: {len(all_issues)}")
        for file, issues in all_issues.items():
            print(f"  {file}: {len(issues)} issues")
    else:
        print("\nNo obvious grammar or content issues detected!")
    
    print("\nNote: This is an automated check. Manual review is still recommended.")
    print("=" * 80)

if __name__ == "__main__":
    main()