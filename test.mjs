import t from 'tap';
import { parse, valid } from 'node-html-parser';

import cdr from "./cdr-data-v3.mjs";

// console.log(cdr);

// structure / completeness
t.test('structure/completeness', t => {
    t.ok('categories' in cdr);
    let categories = Object.values(cdr.categories);
    t.ok(categories.length === 3);
    for (let cat of categories) {
        t.ok('title' in cat);
        t.ok('rules' in cat);
        for (let rule of Object.values(cat.rules)) {
            t.ok('title' in rule);
            t.ok('text' in rule);
            t.ok('questions' in rule);
            t.ok('score_zero_text' in rule);
            t.ok('skipped_text' in rule);
            
            t.ok('1' in rule.questions);
            t.ok('2' in rule.questions);
            t.ok('3' in rule.questions);
            
            for (let q of Object.values(rule.questions)) {
                t.ok('text' in q);
            }
        }
    }
    t.end();
});

t.test('glossary completeness', t => {
    t.ok('glossary' in cdr);
    let terms = Object.values(cdr.glossary);
    for (let term of terms) {
        t.ok("title" in term);
        t.ok("text" in term);
    }
    t.end();
});


// rule  text spans
t.test('rule text spans', t => {
    for (let cat of Object.values(cdr.categories)) {
        for (let rule of Object.values(cat.rules)) {
            // console.log(rule);
            t.ok(valid(rule.text));
        }
    }
    t.end();
});

// questions text spans
t.test('rule text spans', t => {
    for (let cat of Object.values(cdr.categories)) {
        for (let rule of Object.values(cat.rules)) {
            for (let q of Object.values(rule.questions)) {
                console.log(q);
                t.ok(valid(q.text));
                if ('text_scoring' in q) {
                    t.ok(valid(q.text_scoring));
                }
            }
        }
    }
    t.end();
});

// 
t.test('rules have title class in texts', t => {
    for (let cat of Object.values(cdr.categories)) {
        for (let rule of Object.values(cat.rules)) {
            const rtext = parse(rule.text);
            const spans = rtext.querySelectorAll('span[class]');
            // console.log(rule);
            t.ok(spans.length === 1);
        }
    }
    t.end();
});

// terms in glossary
t.test('rule text terms in glossary', t => {
    for (let cat of Object.values(cdr.categories)) {
        for (let rule of Object.values(cat.rules)) {
            const rtext = parse(rule.text);
            const spans = rtext.querySelectorAll('span[data-term]');
            for (let span of spans) {
                let term = span.getAttribute('data-term');
                // console.log(term);
                t.ok(term in cdr.glossary);
            }
        }
    }
    t.end();
});

// terms in glossary
t.test('question text terms in glossary', t => {
    for (let cat of Object.values(cdr.categories)) {
        for (let rule of Object.values(cat.rules)) {
            for (let q of Object.values(rule.questions)) {
                const text = parse(q.text);
                const spans = text.querySelectorAll('span[data-term]');
                for (let span of spans) {
                    let term = span.getAttribute('data-term');
                    t.ok(term in cdr.glossary);
                }
                
                if ('text_scoring' in q) {
                    const text = parse(q.text_scoring);
                    const spans = text.querySelectorAll('span[data-term]');
                    for (let span of spans) {
                        let term = span.getAttribute('data-term');
                        t.ok(term in cdr.glossary);
                    }
                }
            }
        }
    }
    t.end();
});