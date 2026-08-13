export type BilingualText = {
  en: string;
  ar: string;
};

export type HazardRecord = {
  id: string;
  category: "biological" | "toxicological";
  sourceRow: number;
  hazardDisease: BilingualText;
  type: BilingualText;
  definition: BilingualText;
  targetOrganSystem: BilingualText;
  mainConsequences: BilingualText;
  exposureTransmission: BilingualText;
  highRiskOccupationsWorkplace: BilingualText;
  sourceNote: BilingualText;
};

const STUDY_SOURCE_NOTE: BilingualText = {
  en: "Row source: the supplied David Yates study workbook. Content is a concise study summary, not medical advice.",
  ar: "مصدر الصف: ملف الدراسة المرفق المستند إلى ديفيد ييتس. المحتوى ملخص دراسي موجز وليس نصيحة طبية.",
};

const biological = (
  sourceRow: number,
  id: string,
  hazardDisease: BilingualText,
  type: BilingualText,
  definition: BilingualText,
  targetOrganSystem: BilingualText,
  mainConsequences: BilingualText,
  exposureTransmission: BilingualText,
  highRiskOccupationsWorkplace: BilingualText,
): HazardRecord => ({
  id: `bio-${id}`,
  category: "biological",
  sourceRow,
  hazardDisease,
  type,
  definition,
  targetOrganSystem,
  mainConsequences,
  exposureTransmission,
  highRiskOccupationsWorkplace,
  sourceNote: STUDY_SOURCE_NOTE,
});

const toxicological = (
  sourceRow: number,
  id: string,
  hazardDisease: BilingualText,
  type: BilingualText,
  definition: BilingualText,
  targetOrganSystem: BilingualText,
  mainConsequences: BilingualText,
  exposureTransmission: BilingualText,
  highRiskOccupationsWorkplace: BilingualText,
): HazardRecord => ({
  id: `tox-${id}`,
  category: "toxicological",
  sourceRow,
  hazardDisease,
  type,
  definition,
  targetOrganSystem,
  mainConsequences,
  exposureTransmission,
  highRiskOccupationsWorkplace,
  sourceNote: STUDY_SOURCE_NOTE,
});

export const HAZARD_RECORDS: HazardRecord[] = [
  biological(2, "anthrax", { en: "Anthrax", ar: "الجمرة الخبيثة" }, { en: "Bacterial disease (Bacillus anthracis)", ar: "مرض بكتيري (العصوية الجمرية)" }, { en: "A zoonotic infection caused by spore-forming B. anthracis.", ar: "عدوى حيوانية المنشأ تسببها بكتيريا العصوية الجمرية المكوِّنة للأبواغ." }, { en: "Lungs / skin", ar: "الرئتان / الجلد" }, { en: "Cutaneous lesions, severe respiratory disease, or gastrointestinal/systemic illness", ar: "آفات جلدية أو مرض تنفسي شديد أو مرض هضمي/جهازي" }, { en: "Inhalation, skin contact, or ingestion of spores", ar: "استنشاق الأبواغ أو ملامستها للجلد أو ابتلاعها" }, { en: "Agriculture, wool handling, and veterinary work", ar: "الزراعة ومناولة الصوف والعمل البيطري" }),
  biological(3, "brucellosis", { en: "Brucellosis", ar: "داء البروسيلات (الحمى المالطية)" }, { en: "Bacterial disease (Brucella species)", ar: "مرض بكتيري (أنواع البروسيلا)" }, { en: "A systemic zoonotic infection acquired from infected animals or unpasteurized dairy products.", ar: "عدوى جهازية حيوانية المنشأ تنتقل من الحيوانات المصابة أو منتجات الألبان غير المبسترة." }, { en: "Systemic infection", ar: "عدوى جهازية" }, { en: "Fever, fatigue, joint pain, and possible chronic organ involvement", ar: "حمى وإرهاق وآلام مفاصل واحتمال إصابة مزمنة للأعضاء" }, { en: "Animal contact or dairy exposure", ar: "ملامسة الحيوانات أو التعرض لمنتجات الألبان" }, { en: "Livestock and meatpacking work", ar: "تربية الماشية وتجهيز اللحوم" }),
  biological(4, "leptospirosis", { en: "Leptospirosis", ar: "داء اللِّبْتوسبيرات" }, { en: "Bacterial disease (Leptospira species)", ar: "مرض بكتيري (أنواع اللِّبْتوسبيرا)" }, { en: "A zoonotic infection associated with water or soil contaminated by infected animal urine.", ar: "عدوى حيوانية المنشأ ترتبط بالمياه أو التربة الملوثة ببول الحيوانات المصابة." }, { en: "Kidneys / liver", ar: "الكليتان / الكبد" }, { en: "Fever and systemic illness; severe cases may cause kidney or liver injury", ar: "حمى ومرض جهازي؛ وقد تسبب الحالات الشديدة إصابة الكلى أو الكبد" }, { en: "Contact with contaminated water or urine", ar: "ملامسة المياه الملوثة أو البول" }, { en: "Farmers and sewer workers", ar: "المزارعون وعمال الصرف الصحي" }),
  biological(5, "plague", { en: "Plague", ar: "الطاعون" }, { en: "Bacterial disease (Yersinia pestis)", ar: "مرض بكتيري (يرسينيا طاعونية)" }, { en: "A zoonotic infection usually maintained among rodents and their fleas.", ar: "عدوى حيوانية المنشأ تستمر عادة بين القوارض وبراغيثها." }, { en: "Systemic", ar: "جهازي" }, { en: "Bubonic or septicemic disease; pneumonic disease may be rapidly severe", ar: "مرض دبلي أو إنتاني؛ وقد يكون الطاعون الرئوي شديدًا وسريع التطور" }, { en: "Flea bites or contact with infected animals", ar: "لدغات البراغيث أو ملامسة الحيوانات المصابة" }, { en: "Hunters and farmers", ar: "الصيادون والمزارعون" }),
  biological(6, "tetanus", { en: "Tetanus", ar: "الكُزاز" }, { en: "Bacterial disease (Clostridium tetani toxin)", ar: "مرض بكتيري (سمّ المطثية الكزازية)" }, { en: "A toxin-mediated neurologic disease following contamination of a wound with bacterial spores.", ar: "مرض عصبي ناتج عن سم بكتيري بعد تلوث الجرح بالأبواغ." }, { en: "Nervous system", ar: "الجهاز العصبي" }, { en: "Muscle rigidity and painful spasms, with possible breathing compromise", ar: "تيبس عضلي وتشنجات مؤلمة مع احتمال تأثر التنفس" }, { en: "Wound contamination", ar: "تلوث الجروح" }, { en: "Soil and animal workers", ar: "العاملون مع التربة والحيوانات" }),
  biological(7, "tuberculosis", { en: "Tuberculosis", ar: "السُّل" }, { en: "Bacterial disease (Mycobacterium tuberculosis)", ar: "مرض بكتيري (المتفطرة السلية)" }, { en: "An airborne infection that most often affects the lungs but may involve other organs.", ar: "عدوى تنتقل عبر الهواء وتصيب الرئتين غالبًا وقد تمتد إلى أعضاء أخرى." }, { en: "Lungs", ar: "الرئتان" }, { en: "Persistent pulmonary disease; latent infection may later become active", ar: "مرض رئوي مستمر؛ وقد تنشط العدوى الكامنة لاحقًا" }, { en: "Airborne droplet nuclei", ar: "نوى الرذاذ المحمولة جوًا" }, { en: "Healthcare and correctional-facility work", ar: "الرعاية الصحية والعمل في المنشآت الإصلاحية" }),
  biological(8, "tularemia", { en: "Tularemia", ar: "داء التولاريميا" }, { en: "Bacterial disease (Francisella tularensis)", ar: "مرض بكتيري (فرنسيسيلا تولارينسيس)" }, { en: "A zoonotic infection associated with ticks, infected animals, and contaminated aerosols or dust.", ar: "عدوى حيوانية المنشأ ترتبط بالقراد والحيوانات المصابة والهباء أو الغبار الملوث." }, { en: "Systemic", ar: "جهازي" }, { en: "Fever with ulceroglandular, respiratory, or systemic illness depending on route", ar: "حمى مع مرض قرحي عقدي أو تنفسي أو جهازي وفق طريق التعرض" }, { en: "Ticks, animals, or contaminated dust", ar: "القراد أو الحيوانات أو الغبار الملوث" }, { en: "Forestry and meat-processing work", ar: "أعمال الغابات وتجهيز اللحوم" }),
  biological(9, "cat-scratch-disease", { en: "Cat-scratch disease", ar: "داء خدش القطة" }, { en: "Bacterial disease (Bartonella henselae)", ar: "مرض بكتيري (بارتونيلا هنسيلية)" }, { en: "An infection commonly acquired after a cat scratch or bite.", ar: "عدوى تُكتسب عادة بعد خدش القطة أو عضتها." }, { en: "Lymphatic system", ar: "الجهاز اللمفاوي" }, { en: "Local lesion and swollen lymph nodes; complications are uncommon but possible", ar: "آفة موضعية وتضخم العقد اللمفاوية؛ والمضاعفات غير شائعة لكنها ممكنة" }, { en: "Cat bites or scratches", ar: "عضات القطط أو خدوشها" }, { en: "Veterinary workers", ar: "العاملون في الطب البيطري" }),
  biological(10, "hepatitis-a", { en: "Hepatitis A", ar: "التهاب الكبد A" }, { en: "Viral disease (hepatitis A virus)", ar: "مرض فيروسي (فيروس التهاب الكبد A)" }, { en: "An acute viral liver infection transmitted primarily by the fecal-oral route.", ar: "عدوى فيروسية حادة تصيب الكبد وتنتقل أساسًا بطريق البراز-الفم." }, { en: "Liver", ar: "الكبد" }, { en: "Acute hepatitis, fatigue, nausea, and jaundice; it does not cause chronic infection", ar: "التهاب كبد حاد وإرهاق وغثيان ويرقان؛ ولا يسبب عدوى مزمنة" }, { en: "Fecal-oral route", ar: "طريق البراز-الفم" }, { en: "Food and sanitation workers", ar: "العاملون في الأغذية والصرف الصحي" }),
  biological(11, "hepatitis-b", { en: "Hepatitis B", ar: "التهاب الكبد B" }, { en: "Viral disease (hepatitis B virus)", ar: "مرض فيروسي (فيروس التهاب الكبد B)" }, { en: "A viral liver infection spread through infected blood and certain body fluids.", ar: "عدوى فيروسية تصيب الكبد وتنتقل عبر الدم المصاب وبعض سوائل الجسم." }, { en: "Liver", ar: "الكبد" }, { en: "Acute or chronic hepatitis, cirrhosis, and increased liver-cancer risk", ar: "التهاب كبد حاد أو مزمن وتشمّع وزيادة خطر سرطان الكبد" }, { en: "Blood or body-fluid exposure", ar: "التعرض للدم أو سوائل الجسم" }, { en: "Healthcare workers", ar: "العاملون في الرعاية الصحية" }),
  biological(12, "orf", { en: "Orf (contagious ecthyma)", ar: "الأورف (الإكثيما المعدية)" }, { en: "Viral disease (parapoxvirus)", ar: "مرض فيروسي (فيروس بارابوكس)" }, { en: "A zoonotic skin infection acquired mainly from infected sheep or goats.", ar: "عدوى جلدية حيوانية المنشأ تُكتسب أساسًا من الأغنام أو الماعز المصابة." }, { en: "Skin", ar: "الجلد" }, { en: "Localized nodular skin lesions that usually resolve without systemic illness", ar: "آفات جلدية عقدية موضعية تزول عادة دون مرض جهازي" }, { en: "Direct animal or contaminated-material contact", ar: "الملامسة المباشرة للحيوان أو المواد الملوثة" }, { en: "Shepherds and livestock workers", ar: "الرعاة والعاملون مع الماشية" }),
  biological(13, "rabies", { en: "Rabies", ar: "داء الكَلَب" }, { en: "Viral disease (rabies lyssavirus)", ar: "مرض فيروسي (فيروس ليسا المسبب لداء الكلب)" }, { en: "A vaccine-preventable zoonotic neurologic infection transmitted through infected saliva.", ar: "عدوى عصبية حيوانية المنشأ يمكن الوقاية منها باللقاح وتنتقل عبر اللعاب المصاب." }, { en: "Central nervous system", ar: "الجهاز العصبي المركزي" }, { en: "Progressive encephalitis that is nearly always fatal after symptoms begin", ar: "التهاب دماغ مترقٍ يكون قاتلًا في معظم الحالات بعد بدء الأعراض" }, { en: "Animal bite or saliva contacting broken skin or mucosa", ar: "عضة حيوان أو وصول اللعاب إلى جلد مجروح أو غشاء مخاطي" }, { en: "Veterinarians and wildlife handlers", ar: "الأطباء البيطريون ومتعاملو الحياة البرية" }),
  biological(14, "psittacosis", { en: "Psittacosis", ar: "داء الببغائيات" }, { en: "Bacterial disease (Chlamydia psittaci)", ar: "مرض بكتيري (كلاميديا سيتاسي)" }, { en: "A zoonotic respiratory infection associated with infected birds.", ar: "عدوى تنفسية حيوانية المنشأ ترتبط بالطيور المصابة." }, { en: "Respiratory system", ar: "الجهاز التنفسي" }, { en: "Fever and atypical pneumonia, sometimes with systemic complications", ar: "حمى والتهاب رئوي غير نمطي مع احتمال مضاعفات جهازية" }, { en: "Inhalation of aerosolized bird secretions or droppings", ar: "استنشاق إفرازات الطيور أو فضلاتها المتطايرة" }, { en: "Bird owners and poultry-plant workers", ar: "مربو الطيور وعمال مصانع الدواجن" }),
  biological(15, "rocky-mountain-spotted-fever", { en: "Rocky Mountain spotted fever", ar: "حمى جبال روكي المبقعة" }, { en: "Rickettsial bacterial disease (Rickettsia rickettsii)", ar: "مرض بكتيري ريكتسي (ريكتسيا ريكتسية)" }, { en: "A potentially severe tickborne infection caused by an obligate intracellular bacterium.", ar: "عدوى منقولة بالقراد قد تكون شديدة وتسببها بكتيريا داخل خلوية إجبارية." }, { en: "Systemic", ar: "جهازي" }, { en: "Fever, headache, and possible rash; delayed treatment can cause severe multisystem disease", ar: "حمى وصداع واحتمال طفح؛ وقد يؤدي تأخر العلاج إلى مرض شديد متعدد الأجهزة" }, { en: "Tick bite", ar: "لدغة القراد" }, { en: "Outdoor workers", ar: "العاملون في الهواء الطلق" }),
  biological(16, "q-fever", { en: "Q fever", ar: "حمى كيو" }, { en: "Bacterial disease (Coxiella burnetii)", ar: "مرض بكتيري (كوكسيلة بورنيتية)" }, { en: "A zoonotic infection commonly acquired by inhaling contaminated livestock aerosols or dust.", ar: "عدوى حيوانية المنشأ تُكتسب غالبًا باستنشاق هباء أو غبار ملوث من الماشية." }, { en: "Systemic", ar: "جهازي" }, { en: "Acute febrile illness, pneumonia, or hepatitis; uncommon chronic infection may affect the heart", ar: "مرض حموي حاد أو التهاب رئوي أو كبدي؛ وقد تصيب العدوى المزمنة النادرة القلب" }, { en: "Inhalation of livestock-contaminated dust", ar: "استنشاق غبار ملوث من الماشية" }, { en: "Farm and slaughterhouse workers", ar: "عمال المزارع والمسالخ" }),
  biological(17, "aspergillosis", { en: "Aspergillosis", ar: "داء الرشاشيات" }, { en: "Fungal disease (Aspergillus species)", ar: "مرض فطري (أنواع الرشاشيات)" }, { en: "A spectrum of allergic, chronic, or invasive disease caused by inhaled Aspergillus spores.", ar: "طيف من الأمراض التحسسية أو المزمنة أو الغازية تسببه أبواغ الرشاشيات المستنشقة." }, { en: "Lungs", ar: "الرئتان" }, { en: "Allergic airway disease, fungal lung lesions, or invasive infection in susceptible people", ar: "مرض تحسسي بالمجاري الهوائية أو آفات فطرية رئوية أو عدوى غازية لدى المعرضين" }, { en: "Inhalation of spores", ar: "استنشاق الأبواغ" }, { en: "Farmers and workers in dusty environments", ar: "المزارعون والعاملون في البيئات المتربة" }),
  biological(18, "candidiasis", { en: "Candidiasis", ar: "داء المبيضات" }, { en: "Fungal disease (Candida species)", ar: "مرض فطري (أنواع المبيضات)" }, { en: "An infection caused by overgrowth or invasion of Candida yeasts, often at skin or mucosal sites.", ar: "عدوى يسببها فرط نمو خمائر المبيضات أو غزوها، وغالبًا في الجلد أو الأغشية المخاطية." }, { en: "Skin / mucosa", ar: "الجلد / الأغشية المخاطية" }, { en: "Localized rash or mucosal infection; invasive disease can occur in highly susceptible people", ar: "طفح موضعي أو عدوى مخاطية؛ وقد يحدث مرض غازٍ لدى شديدي القابلية" }, { en: "Contact or endogenous overgrowth", ar: "الملامسة أو فرط النمو الداخلي" }, { en: "Food handling and wet work", ar: "مناولة الأغذية والأعمال الرطبة" }),
  biological(19, "coccidioidomycosis", { en: "Coccidioidomycosis (Valley fever)", ar: "داء الكروانيديا (حمى الوادي)" }, { en: "Fungal disease (Coccidioides species)", ar: "مرض فطري (أنواع الكروانيدية)" }, { en: "A soil-associated fungal infection acquired by inhaling airborne spores in endemic areas.", ar: "عدوى فطرية مرتبطة بالتربة تُكتسب باستنشاق الأبواغ المحمولة جوًا في المناطق المتوطنة." }, { en: "Lungs", ar: "الرئتان" }, { en: "Often mild or flu-like respiratory illness; some cases become severe or disseminated", ar: "مرض تنفسي خفيف أو شبيه بالإنفلونزا غالبًا؛ وقد تصبح بعض الحالات شديدة أو منتشرة" }, { en: "Inhalation of contaminated soil dust", ar: "استنشاق غبار التربة الملوث" }, { en: "Construction and agricultural workers", ar: "عمال البناء والزراعة" }),
  biological(20, "histoplasmosis", { en: "Histoplasmosis", ar: "داء النوسجات" }, { en: "Fungal disease (Histoplasma capsulatum)", ar: "مرض فطري (النوسجة المغمدة)" }, { en: "A fungal infection acquired by inhaling spores from disturbed material enriched with bird or bat droppings.", ar: "عدوى فطرية تُكتسب باستنشاق أبواغ من مواد مضطربة غنية بفضلات الطيور أو الخفافيش." }, { en: "Lungs", ar: "الرئتان" }, { en: "Pulmonary illness ranging from mild to severe; dissemination can occur in susceptible people", ar: "مرض رئوي يتراوح من خفيف إلى شديد؛ وقد ينتشر لدى الأشخاص المعرضين" }, { en: "Inhalation of spores from bird or bat droppings", ar: "استنشاق أبواغ من فضلات الطيور أو الخفافيش" }, { en: "Remediation and poultry workers", ar: "عمال المعالجة والدواجن" }),

  toxicological(2, "asbestos", { en: "Asbestos", ar: "الأسبستوس (الحرير الصخري)" }, { en: "Fibrous mineral dust; chronic inhalation hazard", ar: "غبار معدني ليفي؛ خطر استنشاق مزمن" }, { en: "A group of durable mineral fibers whose respirable forms can lodge in the lungs and pleura.", ar: "مجموعة ألياف معدنية متينة يمكن لأجزائها القابلة للاستنشاق أن تستقر في الرئتين وغشاء الجنب." }, { en: "Lungs", ar: "الرئتان" }, { en: "Asbestosis, lung cancer, and mesothelioma", ar: "الأسبستوز وسرطان الرئة والورم المتوسط" }, { en: "Inhalation", ar: "الاستنشاق" }, { en: "Insulation, demolition, maintenance, and other work disturbing asbestos-containing materials; long latency", ar: "العزل والهدم والصيانة وأعمال أخرى تُزعج المواد المحتوية على الأسبستوس؛ كمون طويل" }),
  toxicological(3, "benzene", { en: "Benzene", ar: "البنزين العطري" }, { en: "Volatile aromatic hydrocarbon; hematotoxic carcinogen", ar: "هيدروكربون عطري متطاير؛ مسرطن سام للدم" }, { en: "A volatile organic solvent and fuel component that can damage blood-forming tissue.", ar: "مذيب عضوي متطاير ومكوّن للوقود يمكنه إتلاف الأنسجة المكوِّنة للدم." }, { en: "Blood / bone marrow", ar: "الدم / نخاع العظم" }, { en: "Bone-marrow suppression and leukemia", ar: "تثبيط نخاع العظم واللوكيميا" }, { en: "Primarily inhalation", ar: "الاستنشاق أساسًا" }, { en: "Fuel and chemical production or handling; recognized occupational carcinogen", ar: "إنتاج الوقود والكيماويات أو مناولتها؛ مسرطن مهني معروف" }),
  toxicological(4, "cotton-dust", { en: "Cotton dust", ar: "غبار القطن" }, { en: "Organic textile dust", ar: "غبار نسيجي عضوي" }, { en: "Airborne particles generated during processing of cotton and related plant fibers.", ar: "جسيمات محمولة جوًا تتولد أثناء معالجة القطن والألياف النباتية ذات الصلة." }, { en: "Lungs", ar: "الرئتان" }, { en: "Byssinosis and work-related airway symptoms", ar: "داء البِسّينوز وأعراض تنفسية مرتبطة بالعمل" }, { en: "Inhalation", ar: "الاستنشاق" }, { en: "Textile-industry work", ar: "العمل في صناعة النسيج" }),
  toxicological(5, "arsenic", { en: "Arsenic", ar: "الزرنيخ" }, { en: "Toxic metalloid and carcinogen", ar: "شبه فلز سام ومسرطن" }, { en: "An elemental toxicant whose inorganic compounds can cause acute and chronic systemic effects.", ar: "عنصر سام يمكن لمركباته غير العضوية أن تسبب آثارًا جهازية حادة ومزمنة." }, { en: "Skin / nervous system / liver", ar: "الجلد / الجهاز العصبي / الكبد" }, { en: "Skin lesions, neuropathy, liver injury, and increased cancer risk", ar: "آفات جلدية واعتلال عصبي وإصابة كبدية وزيادة خطر السرطان" }, { en: "Inhalation or ingestion", ar: "الاستنشاق أو الابتلاع" }, { en: "Wood treatment, smelting, and pesticide-related work", ar: "معالجة الأخشاب والصهر والأعمال المرتبطة بالمبيدات" }),
  toxicological(6, "beryllium", { en: "Beryllium", ar: "البريليوم" }, { en: "Light metal; sensitizer and inhalation toxicant", ar: "فلز خفيف؛ مادة محسِّسة وسامة بالاستنشاق" }, { en: "A light metal whose airborne particles can sensitize workers and produce chronic granulomatous lung disease.", ar: "فلز خفيف قد تسبب جسيماته المحمولة جوًا تحسس العاملين ومرضًا رئويًا حبيبيًا مزمنًا." }, { en: "Lungs", ar: "الرئتان" }, { en: "Beryllium sensitization and acute or chronic beryllium lung disease", ar: "التحسس للبريليوم ومرض الرئة الحاد أو المزمن بسببه" }, { en: "Inhalation", ar: "الاستنشاق" }, { en: "Aerospace and light-alloy work", ar: "صناعة الطيران والسبائك الخفيفة" }),
  toxicological(7, "cadmium", { en: "Cadmium", ar: "الكادميوم" }, { en: "Toxic metal and carcinogen", ar: "فلز سام ومسرطن" }, { en: "A metal toxicant encountered in fumes and dust from batteries, plating, and some hot work.", ar: "ملوث فلزي سام يوجد في الأدخنة والغبار الناتج عن البطاريات والطلاء وبعض الأعمال الساخنة." }, { en: "Kidneys / bones", ar: "الكليتان / العظام" }, { en: "Kidney damage, bone effects, and respiratory injury", ar: "تلف الكلى وتأثيرات عظمية وإصابة تنفسية" }, { en: "Primarily inhalation", ar: "الاستنشاق أساسًا" }, { en: "Welding, plating, and battery work", ar: "اللحام والطلاء وأعمال البطاريات" }),
  toxicological(8, "hexavalent-chromium", { en: "Hexavalent chromium", ar: "الكروم سداسي التكافؤ" }, { en: "Cr(VI) compound; sensitizer, irritant, and carcinogen", ar: "مركب كروم سداسي؛ محسِّس ومهيِّج ومسرطن" }, { en: "A group of chromium compounds capable of causing skin and respiratory toxicity.", ar: "مجموعة مركبات كروم يمكنها إحداث سمية جلدية وتنفسية." }, { en: "Skin / lungs", ar: "الجلد / الرئتان" }, { en: "Dermatitis, respiratory irritation, sensitization, and increased lung-cancer risk", ar: "التهاب جلد وتهيج تنفسي وتحسس وزيادة خطر سرطان الرئة" }, { en: "Inhalation or skin contact", ar: "الاستنشاق أو ملامسة الجلد" }, { en: "Stainless-steel welding and pigment work", ar: "لحام الفولاذ المقاوم للصدأ وصناعة الأصباغ" }),
  toxicological(9, "coal-dust", { en: "Coal dust", ar: "غبار الفحم" }, { en: "Respirable mineral/combustible dust", ar: "غبار معدني/قابل للاحتراق وقابل للاستنشاق" }, { en: "Airborne coal-mine dust that may deposit in the lungs after repeated inhalation.", ar: "غبار محمول جوًا من مناجم الفحم قد يترسب في الرئتين بعد الاستنشاق المتكرر." }, { en: "Lungs", ar: "الرئتان" }, { en: "Coal workers’ pneumoconiosis (black lung) and progressive lung impairment", ar: "سحار عمال الفحم (الرئة السوداء) وتدهور رئوي مترقٍ" }, { en: "Inhalation", ar: "الاستنشاق" }, { en: "Coal mining", ar: "تعدين الفحم" }),
  toxicological(10, "cobalt", { en: "Cobalt", ar: "الكوبالت" }, { en: "Metal; respiratory sensitizer and toxicant", ar: "فلز؛ محسِّس وملوث سام للجهاز التنفسي" }, { en: "A metal used in hard metals and alloys whose dust or fumes can affect the airways, lungs, and skin.", ar: "فلز يُستخدم في المعادن الصلبة والسبائك وقد يؤثر غباره أو أدخنته في المجاري الهوائية والرئتين والجلد." }, { en: "Lungs / skin", ar: "الرئتان / الجلد" }, { en: "Asthma-like disease, hard-metal lung disease or fibrosis, and dermatitis", ar: "مرض شبيه بالربو أو مرض الرئة بالمعادن الصلبة/التليف والتهاب الجلد" }, { en: "Inhalation or skin contact", ar: "الاستنشاق أو ملامسة الجلد" }, { en: "Hard-metal tool and alloy work", ar: "صناعة أدوات المعادن الصلبة والسبائك" }),
  toxicological(11, "formaldehyde", { en: "Formaldehyde", ar: "الفورمالدهيد" }, { en: "Reactive volatile aldehyde; irritant, sensitizer, and carcinogen", ar: "ألدهيد متطاير تفاعلي؛ مهيِّج ومحسِّس ومسرطن" }, { en: "A reactive gas used in resins and preservatives that readily irritates exposed tissues.", ar: "غاز تفاعلي يُستخدم في الراتنجات والمواد الحافظة ويهيّج الأنسجة المعرضة بسهولة." }, { en: "Respiratory system", ar: "الجهاز التنفسي" }, { en: "Eye and airway irritation, sensitization, and increased cancer risk", ar: "تهيج العين والمجاري الهوائية والتحسس وزيادة خطر السرطان" }, { en: "Inhalation or skin contact/absorption", ar: "الاستنشاق أو ملامسة/امتصاص الجلد" }, { en: "Laboratories, resin production, and preservative use", ar: "المختبرات وإنتاج الراتنجات واستخدام المواد الحافظة" }),
  toxicological(12, "lead", { en: "Lead", ar: "الرصاص" }, { en: "Cumulative toxic metal", ar: "فلز سام تراكمي" }, { en: "A systemic toxicant that can accumulate in the body after exposure to lead dust, fumes, or contaminated surfaces.", ar: "ملوث سام جهازي قد يتراكم في الجسم بعد التعرض لغبار الرصاص أو أدخنته أو الأسطح الملوثة." }, { en: "Nervous system / kidneys / blood", ar: "الجهاز العصبي / الكليتان / الدم" }, { en: "Neurologic, kidney, and blood disorders; reproductive effects may also occur", ar: "اضطرابات عصبية وكلوية ودموية؛ وقد تحدث آثار تناسلية أيضًا" }, { en: "Inhalation or ingestion", ar: "الاستنشاق أو الابتلاع" }, { en: "Work with lead dust, fumes, or contaminated surfaces", ar: "العمل مع غبار الرصاص أو أدخنته أو الأسطح الملوثة" }),
  toxicological(13, "mercury", { en: "Mercury", ar: "الزئبق" }, { en: "Toxic metal; elemental vapor is a major occupational inhalation hazard", ar: "فلز سام؛ بخاره العنصري خطر استنشاق مهني رئيسي" }, { en: "A metal occurring in several forms whose toxic effects and exposure routes differ by chemical form.", ar: "فلز يوجد بأشكال متعددة تختلف سميتها وطرق التعرض لها باختلاف الشكل الكيميائي." }, { en: "Nervous system", ar: "الجهاز العصبي" }, { en: "Neuropathy and neurobehavioral or neuropsychiatric effects", ar: "اعتلال عصبي وتأثيرات سلوكية عصبية أو نفسية عصبية" }, { en: "Inhalation or ingestion; elemental vapor is especially important occupationally", ar: "الاستنشاق أو الابتلاع؛ والبخار العنصري مهم مهنيًا بوجه خاص" }, { en: "Work involving mercury-containing devices, processes, spills, or contaminated materials", ar: "العمل مع أجهزة أو عمليات أو انسكابات أو مواد ملوثة بالزئبق" }),
  toxicological(14, "manganese", { en: "Manganese", ar: "المنغنيز" }, { en: "Essential metal; neurotoxic at excessive occupational exposure", ar: "فلز أساسي؛ سام عصبيًا عند التعرض المهني المفرط" }, { en: "A metal present in welding consumables and ores whose inhaled fumes or dust can affect the brain.", ar: "فلز يوجد في مستهلكات اللحام والخامات وقد تؤثر أدخنته أو غباره المستنشق في الدماغ." }, { en: "Brain / nervous system", ar: "الدماغ / الجهاز العصبي" }, { en: "Manganism, a Parkinson-like neurologic disorder", ar: "التسمم بالمنغنيز، وهو اضطراب عصبي شبيه بالباركنسون" }, { en: "Inhalation", ar: "الاستنشاق" }, { en: "Welding and mining", ar: "اللحام والتعدين" }),
  toxicological(15, "silica", { en: "Respirable crystalline silica", ar: "السيليكا البلورية القابلة للاستنشاق" }, { en: "Respirable mineral dust; fibrogenic and carcinogenic", ar: "غبار معدني قابل للاستنشاق؛ مسبب للتليف ومسرطن" }, { en: "Fine crystalline silica particles generated when materials such as concrete or stone are cut or ground.", ar: "جسيمات دقيقة من السيليكا البلورية تتولد عند قطع أو طحن مواد مثل الخرسانة أو الحجر." }, { en: "Lungs", ar: "الرئتان" }, { en: "Silicosis, lung fibrosis, and increased lung-cancer risk", ar: "السحار السيليسي وتليف الرئة وزيادة خطر سرطان الرئة" }, { en: "Inhalation", ar: "الاستنشاق" }, { en: "Concrete or stone cutting, grinding, and similar dusty work", ar: "قطع أو طحن الخرسانة أو الحجر والأعمال المتربة المشابهة" }),
  toxicological(16, "zinc-fumes", { en: "Zinc fumes", ar: "أدخنة الزنك" }, { en: "Metal-oxide fume", ar: "دخان أكسيد فلزي" }, { en: "Fine zinc oxide particles typically generated when zinc-containing metal is heated.", ar: "جسيمات دقيقة من أكسيد الزنك تتولد عادة عند تسخين معدن يحتوي على الزنك." }, { en: "Respiratory system", ar: "الجهاز التنفسي" }, { en: "Metal fume fever, a short-term flu-like illness", ar: "حمى أدخنة المعادن، وهي حالة قصيرة الأمد شبيهة بالإنفلونزا" }, { en: "Inhalation", ar: "الاستنشاق" }, { en: "Welding, brazing, or heating galvanized and zinc-containing metals", ar: "لحام أو لحام بالنحاس أو تسخين المعادن المجلفنة والمحتوية على الزنك" }),
  toxicological(17, "aluminum-dust", { en: "Aluminum dust", ar: "غبار الألومنيوم" }, { en: "Metal dust; respiratory and combustible-dust hazard", ar: "غبار فلزي؛ خطر تنفسي وغبار قابل للاحتراق" }, { en: "Fine airborne aluminum particles generated during metal processing; sufficiently dispersed dust can also present a fire or explosion hazard.", ar: "جسيمات ألومنيوم دقيقة محمولة جوًا تتولد أثناء معالجة المعادن؛ وقد يشكل الغبار المشتت بما يكفي خطر حريق أو انفجار أيضًا." }, { en: "Lungs", ar: "الرئتان" }, { en: "Respiratory irritation and possible chronic lung effects; combustible-dust events can cause traumatic injury", ar: "تهيج تنفسي وآثار رئوية مزمنة محتملة؛ وقد تسبب حوادث الغبار القابل للاحتراق إصابات رضّية" }, { en: "Inhalation", ar: "الاستنشاق" }, { en: "Manufacturing and metal processing", ar: "التصنيع ومعالجة المعادن" }),
  toxicological(18, "antimony", { en: "Antimony", ar: "الأنتيمون" }, { en: "Toxic metalloid", ar: "شبه فلز سام" }, { en: "A metalloid used in alloys and flame-retardant applications whose compounds may be present as dust or fumes.", ar: "شبه فلز يُستخدم في السبائك وتطبيقات مثبطات اللهب وقد توجد مركباته في صورة غبار أو أدخنة." }, { en: "Lungs / heart / gastrointestinal system", ar: "الرئتان / القلب / الجهاز الهضمي" }, { en: "Respiratory irritation, gastrointestinal effects, and possible cardiovascular effects depending on compound and exposure", ar: "تهيج تنفسي وتأثيرات هضمية وآثار قلبية وعائية محتملة بحسب المركب والتعرض" }, { en: "Inhalation or ingestion", ar: "الاستنشاق أو الابتلاع" }, { en: "Alloy and flame-retardant work", ar: "صناعة السبائك ومثبطات اللهب" }),
  toxicological(19, "organophosphate-carbamate-pesticides", { en: "Organophosphate and carbamate pesticides", ar: "مبيدات الفوسفات العضوية والكربامات" }, { en: "Cholinesterase-inhibiting pesticides", ar: "مبيدات مثبِّطة لإنزيم الكولين إستيراز" }, { en: "Pesticide classes that can disrupt cholinergic nerve signaling by inhibiting cholinesterase enzymes.", ar: "فئات مبيدات قد تعطل الإشارات العصبية الكولينية عبر تثبيط إنزيمات الكولين إستيراز." }, { en: "Nervous system", ar: "الجهاز العصبي" }, { en: "Cholinergic toxicity with secretions, breathing difficulty, gastrointestinal symptoms, weakness, or neurologic effects", ar: "سمية كولينية تشمل زيادة الإفرازات وصعوبة التنفس وأعراضًا هضمية وضعفًا أو آثارًا عصبية" }, { en: "Skin absorption or inhalation", ar: "الامتصاص عبر الجلد أو الاستنشاق" }, { en: "Agricultural pesticide mixing, loading, application, and equipment cleaning", ar: "خلط المبيدات الزراعية وتحميلها وتطبيقها وتنظيف معداتها" }),
];

const bilingualKeys = [
  "hazardDisease",
  "type",
  "definition",
  "targetOrganSystem",
  "mainConsequences",
  "exposureTransmission",
  "highRiskOccupationsWorkplace",
  "sourceNote",
] as const satisfies readonly (keyof HazardRecord)[];

export function validateHazardRecords(records: readonly HazardRecord[] = HAZARD_RECORDS): void {
  if (records.length !== 37) throw new Error(`Expected 37 hazard records; received ${records.length}.`);

  const ids = new Set<string>();
  let biologicalCount = 0;
  let toxicologicalCount = 0;

  records.forEach((record, index) => {
    if (!record || typeof record !== "object") throw new Error(`Hazard record ${index} is invalid.`);
    if (!record.id.trim() || ids.has(record.id)) throw new Error(`Hazard record ID is missing or duplicated: ${record.id}.`);
    ids.add(record.id);
    if (!Number.isInteger(record.sourceRow) || record.sourceRow < 2) throw new Error(`Invalid source row for ${record.id}.`);
    if (record.category === "biological") biologicalCount += 1;
    else if (record.category === "toxicological") toxicologicalCount += 1;
    else throw new Error(`Invalid category for ${record.id}.`);

    for (const key of bilingualKeys) {
      const value = record[key];
      if (
        !value ||
        typeof value !== "object" ||
        !("en" in value) ||
        !("ar" in value) ||
        typeof value.en !== "string" ||
        typeof value.ar !== "string" ||
        !value.en.trim() ||
        !value.ar.trim()
      ) {
        throw new Error(`Missing bilingual ${key} value for ${record.id}.`);
      }
    }
  });

  if (biologicalCount !== 19 || toxicologicalCount !== 18) {
    throw new Error(`Expected 19 biological and 18 toxicological records; received ${biologicalCount} and ${toxicologicalCount}.`);
  }
}

export const HAZARD_COUNTS = Object.freeze({
  total: HAZARD_RECORDS.length,
  biological: HAZARD_RECORDS.filter((record) => record.category === "biological").length,
  toxicological: HAZARD_RECORDS.filter((record) => record.category === "toxicological").length,
});

validateHazardRecords();
