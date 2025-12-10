#!/bin/bash

# Add header-footer.js script to all HTML files before closing body tag
for file in *.html; do
    if ! grep -q "header-footer.js" "$file"; then
        sed -i 's|</body>|   <script src="js/header-footer.js"></script>\n   </body>|' "$file"
        echo "✓ Added header-footer.js to $file"
    fi
done

# Add header tag to pages that don't have it (except index.html which already has full header)
for file in about.html services.html red-flag-guide.html shop.html vip.html under-construction.html; do
    if ! grep -q '<header' "$file"; then
        # Find the line after body tag and insert header
        sed -i '/<body>/a\   <header class="header" id="header"></header>' "$file"
        echo "✓ Added header to $file"
    fi
done

# Add footer tag to pages that don't have it
for file in about.html services.html red-flag-guide.html shop.html vip.html under-construction.html; do
    if ! grep -q '<footer' "$file"; then
        # Add footer before the scripts
        sed -i 's|   <script|   <footer class="footer"></footer>\n\n   <script|' "$file"
        echo "✓ Added footer to $file"
    fi
done

echo ""
echo "✅ All pages updated with header/footer system!"