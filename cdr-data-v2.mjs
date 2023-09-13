/* 
    Data for Circular Design Rules Project
    https://www.idrv.org/cdr/
    https://cdr.tools/
    
    2023-09-12
    
    TODO:
    * Translation to EN
    * "score_zero_text" and "skipped_text"
    * class="title" in rule texts will be updated
    
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
        * Score = 0: White fill.
        * Score = 1: Light gray fill.
        * Score = 2: Dark gray fill.
        * Score = 3: Black fill.
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
                    "title": "Rezyklat",
                    
                    // data-term denotes a link to a glossary term.
                    // class="title" means this is the title of the rule and the category symbol needs to be inserted before it.
                    "text": "Gestalte das Produkt aus <span data-term=\"erneuerbare materialien\">erneuerbaren Materialien</span> oder <span class=\"title\" data-term=\"rezyklat\">Rezyklat</span>.",
                    "questions": {
                        "1": {
                            "text": "Es werden lokal vorhandene Ressourcen oder <span data-term=\"rezyklat\">Rezyklate</span> genutzt."
                        },
                        "2": {
                            "text": "Das Produkt besteht zu mehr als 50% aus <span data-term=\"rezyklat\">Rezyklat</span> oder <span data-term=\"erneuerbare materialien\">erneuerbaren</span> Materialien."
                        },
                        "3": {
                            "text": "Das Produkt besteht zu mehr als 90% aus <span data-term=\"rezyklat\">Rezyklat</span> oder <span data-term=\"erneuerbare materialien\">erneuerbaren Materialien</span>.",
                            
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
                    "title": "Rezyklierbarkeit",
                    "text": "<span class=\"title\">Rezyklierbarkeit</span>: Gestalte das Produkt aus wiederverwendbaren oder <span data-term=\"biologisch abbaubar\">abbaubaren</span> Materialien.",
                    "questions": {
                        "1": {
                            "text": "Beeinträchtigung der Gesundheit oder der Umwelt durch das Material ist ausgeschlossen."
                        },
                        "2": {
                            "text": "Über 50% der verwendeten Materialien können in den Produktionsprozess zurückgeführt werden oder sind <span data-term=\"biologisch abbaubar\">biologisch abbaubar</span>."
                        },
                        "3": {
                            "text": "Über 90% der verwendeten Materialien können in den Produktionsprozess zurückgeführt werden oder sind <span data-term=\"biologisch abbaubar\">biologisch abbaubar</span>.",
                            "depends_on": "2"
                        }
                    },
                    "score_zero_text": "",
                    "skipped_text": ""
                },
                "m3": {
                    "title": "Reduktion",
                    "text": "<span class=\"title\">Reduktion</span>: Gestalte das Produkt mit einfachen Materialien.",
                    "questions": {
                        "1": {
                            "text": "Eine Auflistung aller im Produkt enthaltenen Materialien ist verfügbar."
                        },
                        "2": {
                            "text": "Alle Materialien im Produkt können effizient separiert werden. Es kommen keine komplexen Materialmischungen oder <span data-term=\"verbundstoffe\">Verbundstoffe</span> zum Einsatz."
                        },
                        "3": {
                            "text": "Das Produkt besteht aus wenigen Materialien oder kann nach Rücknahme von Hersteller*innen oder Partner*innen in seine Ausgangsmaterialien zerlegt werden.",
                            "depends_on": "2"
                        }
                    },
                    "score_zero_text": "",
                    "skipped_text": ""
                }
            }
        },
        "c": {
            "title": "Komponenten",
            "rules": {
                "c1": {
                    "title": "Zerlegbarkeit",
                    "text": "Gestalte die <span class=\"title\">Zerlegbarkeit</span> des Produkts.",
                    "questions": {
                        "1": {
                            "text": "Eine Demontageanleitung ist direkt auf dem Produkt oder digital verfügbar, um die hochwertige Verwertung aller Komponenten zu garantieren."
                        },
                        "2": {
                            "text": "Alle Verbindungen zwischen Komponenten sind leicht und vollständig lösbar."
                        },
                        "3": {
                            "text": "Die Demontage erfolgt automatisiert oder vergleichbar effizient wie die Fertigung.",
                            "depends_on": "2"
                        }
                    },
                    "score_zero_text": "",
                    "skipped_text": ""
                },
                "c2": {
                    "title": "Modularität",
                    "text": "Gestalte das Produkt <span class=\"title\">modular</span>.",
                    "questions": {
                        "1": {
                            "text": "Alle Funktionseinheiten sind in Komponenten separiert."
                        },
                        "2": {
                            "text": "Ein Minimum an Komponenten kommt in einer Vielzahl an Produktvarianten zum Einsatz."
                        },
                        "3": {
                            "text": "Ersatzteile sind verfügbar und ermöglichen eine lange Lebensdauer."
                        }
                    },
                    "score_zero_text": "",
                    "skipped_text": ""
                },
                "c3": {
                    "title": "Update/Upgrade",
                    "text": "Gestalte <span class=\"title\"><span data-term=\"update\">Updates</span> und <span data-term=\"upgrade\">Upgrades</span></span> für das Produkt.",
                    "questions": {
                        "1": {
                            "text": "Von den Hersteller*innen werden <span data-term=\"upgrade\">Upgrades</span> und <span data-term=\"update\">Updates</span> angeboten, damit das Produkt aktuell und attraktiv bleibt."
                        },
                        "2": {
                            "text": "Die Produktkomponenten sind nach gängigen Standards gestaltet oder nutzen <span data-term=\"schnittstellen\">Schnittstellen</span>, um durch standardisierte Komponenten ergänzt zu werden. "
                        },
                        "3": {
                            "text": "Nutzer*innen werden ermächtigt, selbst <span data-term=\"update\">Updates</span> und <span data-term=\"upgrade\">Upgrades</span> vorzunehmen, indem die <span data-term=\"produktdaten\">Produktdaten</span> zugänglich und <span data-term=\"offen\">offen</span> gestaltet sind.",
                            "depends_on": "1,2",
                            
                            // This is an alternative text to be shown on the results/score screen instead of "text".
                            "text_scoring": "<span data-term=\"update\">Updates</span> und <span data-term=\"upgrade\">Upgrades</span> werden vom Hersteller angeboten und Nutzer*innen werden ermächtigt, selbst welche vorzunehmen, indem die <span data-term=\"produktdaten\">Produktdaten</span> zugänglich und <span data-term=\"offen\">offen</span> gestaltet sind und gängigen Standards verwendet werden."
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
                    "title": "Rücknahme",
                    "text": "Gestalte die <span class=\"title\">Rücknahme</span> des Produkts.",
                    "questions": {
                        "1": {
                            "text": "Die Gestaltung des Produkts orientiert sich an bestehenden Systemen der <span data-term=\"wertstoffsammlung\">Wertstoffsammlung</span>."
                        },
                        "2": {
                            "text": "Die Rücknahme des Produkts wird von den Hersteller*innen oder Partner*innen organisiert und angeboten."
                        },
                        "3": {
                            "text": "<span data-term=\"anreizsysteme\">Anreizsysteme</span> für die Rückgabe von verkauften Produkten werden angeboten oder das Produkt bleibt im Besitz der Hersteller*innen.",
                            "depends_on": "2"
                        }
                    },
                    "score_zero_text": "",
                    "skipped_text": ""
                },
                "s2": {
                    "title": "Wiederverwendung",
                    "text": "Gestalte die <span class=\"title\">Wiederverwendung</span> von Produkten und Komponenten.",
                    "questions": {
                        "1": {
                            "text": "Eine Anleitung für die sachgerechte Instandhaltung und Reparatur ist digital verfügbar und ermächtigt Nutzer*innen zur Selbstreparatur des Produkts."
                        },
                        "2": {
                            "text": "Ein Konzept für die Wiederverwendung und Erschließung eines Gebrauchtmarktes ist erstellt."
                        },
                        "3": {
                            "text": "Die zurückgenommenen Produkte werden für die Wiederverwendung aufbereitet oder Komponenten in den Produktionsprozess zurückgeführt.",
                            "depends_on": "2"
                        }
                    },
                    "score_zero_text": "",
                    "skipped_text": ""
                },
                "s3": {
                    "title": "Service",
                    "text": "Gestalte das Produkt als <span class=\"title\" data-term=\"service\">Service</span>.",
                    "questions": {
                        "1": {
                            "text": "Die Hersteller*innen übernehmen Verantwortung für die Nutzungsdauer des Produkts."
                        },
                        "2": {
                            "text": "Durch den <span data-term=\"service\">Service</span> wird einer Vielzahl von Nutzer*innen ein Zugang zum Produkt ermöglicht."
                        },
                        "3": {
                            "text": "Das Produkt wird nicht verkauft, sondern nur sein Nutzen angeboten.",
                            "text_scoring": "Durch den <span data-term=\"service\">Service</span> wird einer Vielzahl von Nutzer*innen ein Zugang zum Produkt ermöglicht und das Produkt wird nicht verkauft, sondern nur sein Nutzen angeboten.",
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
        "rezyklat": {
            "title": "Rezyklat",
            "text": "Recycelte Materialien, die aus bereits verwendeten Produkten oder Verpackungen gewonnen werden.",
        },
        "erneuerbare materialien": {
            "title": "Erneuerbare Materialien",
            "text": "Ressourcen, die sich auf natürliche Weise regenerieren können und somit nachhaltig genutzt werden können.",
        },
        "biologisch abbaubar": {
            "title": "Biologisch abbaubar",
            "text": "Materialien, die von natürlichen Prozessen zersetzt werden können, ohne schädliche Rückstände zu hinterlassen."
        },
        "verbundstoffe": {
            "title": "Verbundstoffe",
            "text": "Materialien, die aus mindestens zwei verschiedenen Materialitäten bestehen, die vollflächig miteinander verbunden sind und sich nur schwer trennen lassen."
        },
        "upgrade": {
            "title": "Upgrade",
            "text": "Aktualisierung oder Verbesserung eines Produkts oder einer Software, um eine höhere Leistung oder zusätzliche Funktionen zu bieten."
        },
        "update": {
            "title": "Update",
            "text": "Korrekturen, Verbesserungen oder neuen Informationen für eine vorhandene Software oder ein Produkt, um die Stabilität und Funktionalität zu optimieren oder Fehler zu beheben."
        },
        "schnittstellen": {
            "title": "Schnittstellen",
            "text": "Verbindungen zwischen den Teilen eines Produkts, die deren Zusammenarbeit und Interaktion ermöglichen."
        },
        "produktdaten": {
            "title": "Produktdaten",
            "text": "Informationen zum Produkt, die Details zum Aufbau, Komponenten und Anleitungen umfassen."
        },
        "offen": {
            "title": "Offen",
            "text": "Freie Zugänglichkeit von Informationen, die ohne rechtliche Einschränkungen genutzt oder angepasst werden können."
        },
        "wertstoffsammlung": {
            "title": "Wertstoffsammlung",
            "text": "Lokal variierendes System zur Sammlung und Trennung von wiederverwertbaren Materialien, um sie zu recyceln."
        },
        "anreizsysteme": {
            "title": "Anreizsysteme",
            "text": "Anregungen, die Nutzer*innen motivieren sollen, bestimmte Handlungen, Verhaltensweisen oder Ziele zu erreichen."
        },
        "service": {
            "title": "Service",
            "text": "Dienstleistung, die von einer Organisation erbracht wird, um die Bedürfnisse von Nutzer*innen zu erfüllen."
        }
    }

};