import re

def process_file(filename, replacements):
    with open(filename, 'r', encoding='utf-8') as f:
        c = f.read()
    for old, new in replacements:
        c = c.replace(old, new)
    with open(filename, 'w', encoding='utf-8') as f:
        f.write(c)

css_replacements = [
    ('[data-mode="simple"]', '[data-mode="air"]'),
    ('#simpleMode', '#airMode'),
    ('.simple-nav', '.air-nav'),
    ('.mt-simple', '.mt-air'),
    ('snav-', 'airnav-'),
]
process_file('style.css', css_replacements)

js_replacements = [
    ("==='simple'", "==='air'"),
    ("=== 'simple'", "=== 'air'"),
    ("'simple'", "'air'"),
    ('"simple"', '"air"'),
    ('setItem(\'jg-mode\', mode)', 'setItem(\'jg-mode\', mode)'),
    ('mt-simple', 'icon-air'),
    ('.mt-dev', '.icon-dev'),
    ('mtPill', ''), # we removed pills
    ('data-stab', 'data-airtab'),
    ('stab-', 'airtab-'),
    ('activateSimpleTab', 'activateAirTab'),
    ('simpleCurtainIntro', 'airIntro'),
]
process_file('script.js', js_replacements)

html_replacements = [
    ('data-stab', 'data-airtab'),
    ('stab-', 'airtab-'),
]
process_file('index.html', html_replacements)
