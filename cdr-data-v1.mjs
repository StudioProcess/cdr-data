/* 
    This is an example data structure for the Circular Design Rules Project
    https://www.idrv.org/cdr/
    
    2023-09-07
    
    Overview:
    * There are 9 (Circular Design) Rules: M1, M2, M3, C1, C2, C3, S1, S2, S3
    * The 9 Rules are organized in 3 Categories (3 rules each): M (Materials), C (Components), S (Services)
    * Each Category has a graphical symbol: M = Triangle, C = Diamond, S = Pentagon
    * Each Rule has 3 Questions, which are answered Yes or No
    
    Process:
    1) User picks next Category from the ones that haven't been picked e.g. M
        2) Get next rule of the chosen category in order: e.g. M1, M2, M3
            3) Get next question of the rule in order: 1, 2, 3
                4) If the question depends on previous questions (see "depends_on" field), and any one of these dependencies was answered No, skip the question. -> Go to 3)
                5) Show the question. User can answer Yes or No. Record the answer.
                    6) If this is the FIRST question within the rule, the user can click "Skip Rule". In this case the entire rule is skipped and the skipping recorded. -> Go to 2)
    
    Example Results Record:
    {
        m1: {
            answers: { 1: 'y', 2: 'n', 3: 'n' },    // Could also use [ 'y', 'n', 'n' ] if preferred
            score: 1,
        },
        m2: {
            skipped: true,
        },
        m3: {
            answers: { 1: 'n', 2: 'n', 3: '-' },
            score: 0,
        },
        ...
    }
        
    * A score is calculated per rule, and is equal to the number of yes answers i.e. min score = 0, max score = 3.
    * If the rule was skipped there are no 'answers' and 'score' fields, but a 'skipped' field set to true.
    * If a question was skipped due to a dependency check, the corresponding answer is recorded as '-'
    
    Results screen:
    * Shows the scores of the 9 rules as shaded gemetric forms (arranged in a circle):
        * Skipped: Dashed outline, no fill.
        * Score = 0: White fill.
        * Score = 1: Light gray fill.
        * Score = 2: Dark gray fill.
        * Score = 3: Black fill.
    * Shows a list of textual results for each rule.
        * For each rule:
            * If score = 0 for the rule (no questions were answered yes), show the special 'score_zero_text'.
            * If the rule was skipped, show the special 'skipped_text'.
            * Otherwise, for each question within the rule:
                * If the answer was yes:
                    * If the question has the field 'text_scoring' and it is not empty, show 'text_scoring'
                    * Otherwise show the field 'text'
                    * If the question has a non-empty 'depends_on' field, hide the question texts given by 'depends_on'.
    
    Glossary/Terms:
    * There is a number of terms that can be linked to from rule and question texts.
    * The glossary page is also generated from this data.
    * We use <span> elements with a 'data-term' attribute to link to glossary terms.
        * If the data-term attribute exists and is non-empty, use the value of the data-term attribute to as index into the glossary.
        * If the data-term attribute exists and is empty, use the content of the span element as index into the glossary.
    
    Misc:
    * A class 'title' is added to spans within rule texts, in order to show the category symbol (triangle, diamond, pentagon) in front of the span.
*/

export default {
    
    "categories": {
        "m": {
            "title": "Material",
            "rules": {
                "m1": {
                    "title": "Recyclate",
                    
                    // data-term denotes a link to a glossary term.
                    // class="title" means this is the title of the rule and the category symbol needs to be inserted before it.
                    "text": "Design the product out of <span data-term>renewable materials</span> or <span class=\"title\" data-term>recyclate</span>.",
                    "questions": {
                        "1": {
                            "text": "Locally available resources or recyclates are used."
                        },
                        "2": {
                            "text": "The product consists of more than 50% recyclate or renewable materials."
                        },
                        "3": {
                            "text": "The product consists of more than 90% recyclate or renewable materials.",
                            
                            // This question is only shown if ALL dependencies were answered yes.
                            // On scoring/results screen: If this question was answered yes, show this question, but hide all the dependencies.
                            // Note: This can also be a comma separated list e.g. "1,2"
                            "depends_on": "2"
                        }
                    },
                    
                    // This text is shown in scoring if all questions were answered no (score = 0).
                    "score_zero_text": "",
                    
                    // This text is shown in scoring, if the rule was skipped
                    "skipped_text": "",
                },
                "m2": {
                    "title": "Recyclability",
                    "text": "Design the product out of reusable or <span data-term=\"bio-degradable\">degradable</> materials.",
                    "questions": {
                        "1": {
                            "text": "Materials harmful to human health or the environment are excluded."
                        },
                        "2": {
                            "text": "More than 50% of the used material can be reused in the production process or is bio-degradable."
                        },
                        "3": {
                            "text": "More than 90% of the used material can be reused in the production process or is bio-degradable.",
                            "depends_on": "2"
                        }
                    }
                },
                "m3": {
                    "title": "Reduction",
                    "text": "Design the product with simple materials.",
                    "questions": {
                        "1": {
                            "text": "A list of all materials contained in the product is available."
                        },
                        "2": {
                            "text": "All materials in the product can be efficiently separated. No complex material mixtures or <span data-term>composites</span> are used."
                        },
                        "3": {
                            "text": "The product consists of little material or can be separated into its original materials once the manufacturer or partner has taken the product back."
                        }
                    }
                }
            }
        },
        "c": {
            "title": "Components",
            "rules": {
                "c1": { /* ... */ },
                "c2": { /* ... */ },
                "c3": {
                    "title": "Update/Upgrade",
                    "text": "Design updates and upgrades for the product.",
                    "questions": {
                        "1": {
                            "text": "Updates and upgrades are offered by the manufacturer so that the product remains up to date and attractive."
                        },
                        "2": {
                            "text": "The product components are designed in keeping with common standards or use interfaces that can be extended with standardized components."
                        },
                        "3": {
                            "text": "Users are empowered to make updates and upgrades themselves as the product data and its design are easily accessible.",
                            "depends_on": "1,2",
                            
                            // This text is shown on the results/score screen instead of "text"
                            "text_scoring": "Updates und Upgrades werden vom Hersteller angeboten und Nutzer*innen werden ermächtigt, selbst welche vorzunehmen, indem die Produktdaten zugänglich und offen gestaltet sind und gängigen Standards verwendet werden."
                        }
                    }
                }
            }
        },
        "s": {
            "title": "Services",
            "rules": {
                "s1": { /* ... */ },
                "s2": { /* ... */ },
                "s3": {
                    "title": "Service",
                    "text": "Design the product as a service.",
                    "questions": {
                        "1": {
                            "text": "The manufacturer assumes responsibility for the service life of the product."
                        },
                        "2": {
                            "text": "The service enables access to the product for a multitude of users."
                        },
                        "3": {
                            "text": "The product is not sold, rather only its use is offered.",
                            "text_scoring": "The service enables access to the product for a multitude of users and the product is not sold, rather only its use is offered.",
                            "depends_on": "2"
                        }
                    }
                }
            }
        },
    },
    
    "glossary": {
        "recyclate": {
            "title": "Recyclate",
            "text": "Recycelte Materialien, die aus bereits verwendeten Produkten oder Verpackungen gewonnen werden.",
        },
        "renewable materials": {
            "title": "Renewable materials",
            "text": "Ressourcen, die sich auf natürliche Weise regenerieren können und somit nachhaltig genutzt werden können.",
        },
        "bio-degradable": {
            "title": "Bio-degradable",
            "text": "Materialien, die von natürlichen Prozessen zersetzt werden können, ohne schädliche Rückstände zu hinterlassen."
        },
        "composites": {
            "title": "Composites",
            "text": "Materialien, die aus mindestens zwei verschiedenen Materialitäten bestehen, die vollflächig miteinander verbunden sind und sich nur schwer trennen lassen."
        }
        
        /* ... */
    }

};