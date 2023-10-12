/* 
    Data for Circular Design Rules Project
    https://www.idrv.org/cdr/
    https://cdr.tools/
    
    2023-10-10
    
    TODO:
    * Complete links to glossary terms (inside glossary)
    * Add percentage links
    * "score_zero_text" and "skipped_text"
    
    Overview:
    * There are 9 (Circular Design) Rules: M1, M2, M3, C1, C2, C3, S1, S2, S3
    * The 9 Rules are organized in 3 Categories (3 rules each): M (Materials), C (Components), S (Services)
    * Each Category has a graphical symbol: M = Triangle, C = Diamond, S = Pentagon
    * Each Rule has 3 Questions, which are answered Yes or No.
    
    Process:
    1) User picks next Category from the ones that haven't been picked yet (Example: User picks Category M).
        2) Get next rule of the chosen category in order (Example: M1, M2, M3).
            3) Get next question of the rule in order: 1, 2, 3
                4) If the question depends on previous questions (see "depends_on" field), and any one of these dependencies was answered No, skip the question. -> Go to step 3)
                5) Show the question. User can answer Yes or No. Record the answer.
                    6) If this is the FIRST question within the rule, the user can click "Skip Rule". In this case the entire rule is skipped and the skipping recorded. -> Go to step 2)
    
    Example Results Record:
    {
        m1: {
            answers: { 1: 'y', 2: 'n', 3: 'n' },
            score: 1
        },
        m2: {
            skipped: true
        },
        m3: {
            answers: { 1: 'n', 2: 'n', 3: '-' },
            score: 0
        },
        ...
    }
        
    * A score is calculated per rule, and is equal to the number of Yes answers (-> min score = 0, max score = 3).
    * If the rule was skipped there are no 'answers' and 'score' fields, but a 'skipped' field set to true.
    * If a question was skipped due to a dependency check, the corresponding answer is recorded as '-'.
    
    Results screen:
    * Shows the scores of the 9 rules as shaded gemetric forms (arranged in a circle):
        * Skipped: Dashed outline, no fill.
        * Score = 0: No fill (solid outline).
        * Score = 1: Light gray fill (solid outline).
        * Score = 2: Dark gray fill (solid outline).
        * Score = 3: Black fill (solid outline).
    * Shows a list of textual results for each rule.
        * For each rule:
            * If score = 0 for the rule (no questions were answered Yes), show the special 'score_zero_text'.
            * If the rule was skipped, show the special 'skipped_text'.
            * Otherwise, for each question within the rule:
                * If the answer was Yes:
                    * If the question has the field 'text_scoring' and it is not empty, show 'text_scoring'
                    * Otherwise show the field 'text'
                    * If the question has a non-empty 'depends_on' field, hide the question texts given by 'depends_on'.
    
    Glossary/Terms:
    * There is a number of terms that can be linked to from rule and question texts.
    * The glossary page is also generated from this data.
    * We use <span> elements with a 'data-term' attribute to link to glossary terms.
        * If the data-term attribute exists, use the value of the data-term attribute to as index into the glossary.
    
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
                    "text": "Design the product out of <span data-term=\"renewable materials\">renewable materials</span> or <span class=\"title\" data-term=\"recyclate\">recyclate</span>",
                    "questions": {
                        "1": {
                            "text": "The product consists of more than 25% <span data-term=\"recyclate\">recyclate</span> or <span data-term=\"renewable materials\">renewable materials</span>."
                        },
                        "2": {
                            "text": "The product consists of more than 50% <span data-term=\"recyclate\">recyclate</span> or <span data-term=\"renewable materials\">renewable materials</span>."
                        },
                        "3": {
                            "text": "The product consists of more than 90% <span data-term=\"recyclate\">recyclate</span> or <span data-term=\"renewable materials\">renewable materials</span>.",
                            
                            // This question is only shown if ALL dependencies were answered yes.
                            // On scoring/results screen: If this question was answered yes, show this question, but hide all the dependencies.
                            // Note: This can also be a comma separated list in case of multiple dependencies e.g. "1,2"
                            "depends_on": "2"
                        }
                    },
                    
                    // This text is shown in scoring if all questions were answered no (score = 0).
                    "score_zero_text": "",
                    
                    // This text is shown in scoring, if the rule was skipped.
                    "skipped_text": ""
                },
                "m2": {
                    "title": "Recyclability",
                    "text": "Design the product out of <span class=\"title\" data-term=\"recyclability\">recyclable</span> or <span data-term=\"biodegradable\">biodegradable</span> materials.",
                    "questions": {
                        "1": {
                            "text": "More than 25% of the materials used can actually be <span data-term=\"recyclability\">recycled</span> or are <span data-term=\"biodegradable\">biodegradable</span>."
                        },
                        "2": {
                            "text": "More than 50% of the materials used can actually be <span data-term=\"recyclability\">recycled</span> or are <span data-term=\"biodegradable\">biodegradable</span>.",
                            "depends_on": "1"
                        },
                        "3": {
                            "text": "More than 75% of the materials used can actually be <span data-term=\"recyclability\">recycled</span> or are <span data-term=\"biodegradable\">biodegradable</span>.",
                            "depends_on": "1,2"
                        }
                    },
                    "score_zero_text": "",
                    "skipped_text": ""
                },
                "m3": {
                    "title": "Reduction",
                    "text": "<span class=\"title\">Reduction</span>: Design the product with <span data-term=\"simple materials\">simple materials</span>",
                    "questions": {
                        "1": {
                            "text": "A list of all product materials is available."
                        },
                        "2": {
                            "text": "The product consists of at least 80% <span data-term=\"simple materials\">simple materials</span>."
                        },
                        "3": {
                            "text": "No <span data-term=\"complex materials\">complex materials</span> are used in the product.",
                            "depends_on": "2"
                        }
                    },
                    "score_zero_text": "",
                    "skipped_text": ""
                }
            }
        },
        "c": {
            "title": "Components",
            "rules": {
                "c1": {
                    "title": "Separability",
                    "text": "Design the <span class=\"title\" data-term=\"separability\">separability</span> of the product",
                    "questions": {
                        "1": {
                            "text": "Disassembly instructions are available."
                        },
                        "2": {
                            "text": "The product is designed for quick and easy repair."
                        },
                        "3": {
                            "text": "The product is optimized for the <span data-term=\"separability\">separation</span> of all recyclables after the use phase.",
                            "depends_on": "2"
                        }
                    },
                    "score_zero_text": "",
                    "skipped_text": ""
                },
                "c2": {
                    "title": "Modularity",
                    "text": "Design the product <span class=\"title\" data-term=\"modular\">modularly</span>",
                    "questions": {
                        "1": {
                            "text": "Individual replacement parts are available."
                        },
                        "2": {
                            "text": "All <span data-term=\"functional units\">functional units</span> are <span data-term=\"modular\">modular</span> and easy to separate."
                        },
                        "3": {
                            "text": "Components can be assembled or reassembled into different configurations."
                        }
                    },
                    "score_zero_text": "",
                    "skipped_text": ""
                },
                "c3": {
                    "title": "Update/Upgrade",
                    "text": "Design <span class=\"title\"><span data-term=\"update\">update</span> and <span data-term=\"upgrade\">upgrades</span></span> for the product",
                    "questions": {
                        "1": {
                            "text": "Maintenance measures or instructions are available."
                        },
                        "2": {
                            "text": "The product can be improved with measures offered by the manufacturer."
                        },
                        "3": {
                            "text": "The product can be improved with freely available and documented measures.",
                            "depends_on": "1,2",
                            
                            // This is an alternative text to be shown on the results/score screen instead of "text".
                            "text_scoring": ""
                        }
                    },
                    "score_zero_text": "",
                    "skipped_text": ""
                }
            }
        },
        "s": {
            "title": "Services",
            "rules": {
                "s1": {
                    "title": "Take-back",
                    "text": "Design the <span class=\"title\" data-term=\"take-back\">take-back</span> process of the product",
                    "questions": {
                        "1": {
                            "text": "The product indicates the recyclable material category for disposal in the existing <span data-term=\"collection\">collection system</span>."
                        },
                        "2": {
                            "text": "The manufacturer or partner organizes and offers the product take-back."
                        },
                        "3": {
                            "text": "There are also <span data-term=\"incentive systems\">incentives</span> for the return of purchased products.",
                            "depends_on": "2"
                        }
                    },
                    "score_zero_text": "",
                    "skipped_text": ""
                },
                "s2": {
                    "title": "Reuse",
                    "text": "Design the <span class=\"title\" data-term=\"reuse\">reuse</span> of products",
                    "questions": {
                        "1": {
                            "text": "The <span data-term=\"value\">value</span> of the product is guaranteed over a longer period of time."
                        },
                        "2": {
                            "text": "Reuse is implemented by the manufacturer itself or by a partner company."
                        },
                        "3": {
                            "text": "The products taken back are <span data-term=\"reintroduction\">reintroduced</span> into the production process.",
                            "depends_on": "2"
                        }
                    },
                    "score_zero_text": "",
                    "skipped_text": ""
                },
                "s3": {
                    "title": "Service",
                    "text": "Design the product as a <span class=\"title\" data-term=\"service\">service</span>",
                    "questions": {
                        "1": {
                            "text": "The manufacturers <span data-term=\"guarantee\">guarantee</span> a service life beyond the legal requirements."
                        },
                        "2": {
                            "text": "The product is designed with <span data-term=\"service\">service</span> systems."
                        },
                        "3": {
                            "text": "The product is not sold, rather only its <span data-term=\"product use\">use</span> is offered.",
                            "text_scoring": "",
                            "depends_on": "2"
                        }
                    },
                    "score_zero_text": "",
                    "skipped_text": ""
                }
            }
        },
    },
    
    "glossary": {
        // m1
        "renewable materials": {
            "title": "Renewable materials",
            "text": "Resources that can regenerate naturally and thus be used sustainably. Example: Wood. Renewable materials become part of the “Biological Cycle” again.",
        },
        "recyclate": {
            "title": "Recyclate",
            "text": "Materials that can be reused from a recycling process. Example: PET that is recovered from plastic bottles. Recyclable materials should remain in the “Technical Cycle”.",
        },
        "percentage m1": {
            "title": "Percentage (Recyclate)",
            "text": "The ratio refers to the total material weight of the product. Formula: (renewable material weight + recyclate material weight) / total product weight × 100."
        },
        
        // m2
        "recyclability": {
            "title": "Recyclability",
            "text": "The capacity of a product to be reused as a secondary material after the recycling process."
        },
        "biodegradable": {
            "title": "Biodegradable",
            "text": "Materials that can decompose by natural processes without leaving harmful residues in nature. For compostable materials, industrial composting can also be factored into the scoring. In principle, biodegradable materials are preferable when they potentially end up in the environment."
        },
        "percentage m2": {
            "title": "Percentage (Recyclability)",
            "text": "The data must correspond to the actual material recycling rate! Example: PET bottles can be recycled very effectively, but in Austria they only have a recycling rate of approx. 50%. Due to a lack of efficient recycling processes, many materials are incinerated, landfilled, or recycled at a low quality (see also simple materials).\nWhen a product has an LCA (Life Cycle Assessment), this value can be applied directly. Otherwise, the following formula applies: (recyclable material weight × recycling rate + biodegradable material weight) / total product weight × 100."
        },
        
        // m3
        "simple materials": {
            "title": "Simple materials",
            "text": "The source material is biological (e.g. wood) or a widely used technical material that can be kept in circulation well and is readily available (e.g. PP, PET, aluminum, steel, copper)."
        },
        "complex materials": {
            "title": "Complex materials",
            "text": "Examples: alloys, textiles with a blend of synthetic and natural fibers, composites, or materials with surface coatings."
        },
        "percentage m3": {
            "title": "Percentage (Reduction)",
            "text": "Formula: simple material weight / total product weight × 100."
        },
        
        // c1
        "separability": {
            "title": "separability",
            "text": "Facilitating rapid and economic separation of whole components for remanufacturing or a manual or automated separation (e.g. shredding) of material flows for high-value recycling are essential prerequisites for a circular economy."
        },
        
        // c2
        "functional units": {
            "title": "Functional units",
            "text": "Separate designs facilitate both material and functional optimization. Different lifespans of the components should be avoided! Example: a mattress with different additively designed functions (surface, upholstery, springs)."
        },
        "modular": {
            "title": "modular",
            "text": ""
        },
        
        // c3
        "update": {
            "title": "Update",
            "text": "Corrections, improvements, or new information for a product to optimize stability and functionality or to fix defects. Example: Fashion customization, such as changeable covers."
        },
        "upgrade": {
            "title": "Upgrade",
            "text": "Upgrading or improving a product to provide better performance or additional features. Examples: An office chair can be retrofitted with an armrest. A camera component of a cell phone can be replaced with a better module."
        },
        
        // s1
        "take-back": {
            "title": "Take-back",
            "text": "For a circular economy, conventional recycling or incineration must be avoided to the greatest possible extent. A take-back system allows entire components (re-manufacturing) or materials (high-value recycling) to be reintroduced into the production process.\nPlanning reverse logistics is a design challenge: pick-up service, packaging, and environmentally-friendly transport must be taken into account."
        },
        "collection": {
            "title": "Collection of recyclable materials",
            "text": "Local systems for collecting and separating recyclable materials in order to recycle them vary. Collection systems usually incinerate or landfill a large fraction of the materials. See Material."
        },
        "incentive systems": {
            "title": "Incentive systems",
            "text": "Incentives intended to motivate users to perform certain actions, behaviors, or achieve certain goals. Examples: free return, deposit, credit on new products, product exchange for new products."
        },
        
        // s2
        "value": {
            "title": "Value",
            "text": "A circular strategy aims to slow down the cycle in the (post-)use phase and to keep the value of the product, including its components and materials at the <span data-term=\"high-value recycling\">highest level</span> for as long as possible."
        },
        "reuse": {
            "title": "Reuse",
            "text": "Renewed usage of an existing product. Example: Offering on a secondary market, which increases the probability of an extended service life."
        },
        "high-value recycling": {
            "title": "High-value recycling",
            "text": "Materials can be reused at a high quality, or entire components can be reintroduced into the production process via remanufacturing."
        },
        "reintroduction": {
            "title": "Reintroduction into the production process",
            "text": "Materials can be reused at a high quality (“high-value recycling”), or entire components can be reintroduced into the production process via remanufacturing."
        },
        
        // s3
        "guarantee": {
            "title": "Guarantee",
            "text": "In Austria, there is a two-year legal guarantee on movable goods and three years for immovable goods."
        },
        "service": {
            "title": "Service",
            "text": "A service provided by the manufacturer or a commissioned service organization to fulfill the needs of users. Example: sharing systems"
        },
        "product use": {
            "title": "Product use",
            "text": "Example: “Doing laundry” is the use of a washing machine. This service can also be offered as a subscription. The washing machine remains in the possession of the service provider."
        },
    }

};