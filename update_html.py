import re
import os

def update_passage(html, name, content):
    pattern = rf'(<tw-passagedata[^>]*name="{name}"[^>]*>).*?(</tw-passagedata>)'
    if re.search(pattern, html, flags=re.DOTALL):
        start_tag_match = re.search(rf'<tw-passagedata[^>]*name="{name}"[^>]*>', html)
        start_tag = start_tag_match.group(0)
        old_block_pattern = rf'<tw-passagedata[^>]*name="{name}"[^>]*>.*?</tw-passagedata>'
        new_block = f'{start_tag}{content}</tw-passagedata>'
        return re.sub(old_block_pattern, new_block, html, flags=re.DOTALL)
    else:
        new_passage = f'<tw-passagedata name="{name}" tags="" size="100,100" position="0,0">{content}</tw-passagedata>'
        return html.replace('</tw-storydata>', f'{new_passage}</tw-storydata>')

def update_css(html, css_content):
    pattern = r'(<style role="stylesheet" id="twine-user-stylesheet" type="text/twine-css">).*?(</style>)'
    start_tag = '<style role="stylesheet" id="twine-user-stylesheet" type="text/twine-css">'
    new_style = f'{start_tag}{css_content}</style>'
    return re.sub(pattern, new_style, html, flags=re.DOTALL)

if __name__ == "__main__":
    with open("index.html", "r") as f:
        html = f.read()

    css_content = ""
    for css_file in ["src/css/styles.css", "src/css/creation.css", "src/css/traits.css"]:
        if os.path.exists(css_file):
            with open(css_file, "r") as f:
                css_content += f"/* {css_file} */\n" + f.read() + "\n"

    html = update_css(html, css_content)

    twee_dir = "src/twee"
    for filename in os.listdir(twee_dir):
        if filename.endswith(".twee"):
            with open(os.path.join(twee_dir, filename), "r") as f:
                content = f.read()

            passages = re.split(r'^::\s*', content, flags=re.MULTILINE)
            for p in passages:
                if not p.strip(): continue
                lines = p.split("\n")
                name_line = lines[0].strip()
                name_match = re.match(r'^([^\[\{]+)', name_line)
                if not name_match: continue
                name = name_match.group(1).strip()

                p_content = "\n".join(lines[1:]).strip()
                p_content = p_content.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;")
                html = update_passage(html, name, p_content)

    html = html.replace("Charisma", "Charm").replace("Charismatic", "Charming")

    with open("index.html", "w") as f:
        f.write(html)
