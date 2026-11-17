import {
  FreeAlternative,
  HardwareProfile,
  MaintenanceStatus,
  ReplacementAssessment,
  SoftwareCategory,
  SoftwareEntry,
} from '../types/software';

/* ============================================================================
 * 1. 7 FREE ENGINEERING WORKFLOW STACKS (منظومات العمل المجانية حسب التخصص)
 * ============================================================================ */

export interface WorkflowStackStage {
  stageAr: string;
  stageEn: string;
  programId: string;
  programName: string;
  roleAr: string;
  roleEn: string;
  formats: string[];
}

export interface WorkflowStack {
  id: string;
  titleAr: string;
  titleEn: string;
  audienceAr: string;
  audienceEn: string;
  summaryAr: string;
  summaryEn: string;
  replacesCommercial: string[];
  stages: WorkflowStackStage[];
  strengthsAr: string[];
  strengthsEn: string[];
  caveatsAr: string[];
  caveatsEn: string[];
  hardwareSummaryAr: string;
  hardwareSummaryEn: string;
  minimumRamGb: number;
}

export const WORKFLOW_STACKS: WorkflowStack[] = [
  {
    id: 'free-engineering-office',
    titleAr: 'منظومة مكتب هندسي مجاني',
    titleEn: 'Free Engineering Office Stack',
    audienceAr: 'للمكاتب الاستشارية الناشئة والمهندسين المستقلين',
    audienceEn: 'For independent engineering practices & small consultancies',
    summaryAr:
      'بيئة عمل متكاملة تغطي الرسم الهندسي 2D، نمذجة الـ BIM، الإظهار المعماري، المستندات، تحرير الـ PDF، والمخططات الإدارية دون تراخيص سنوية.',
    summaryEn:
      'Complete office pipeline covering 2D drafting, OpenBIM modeling, visualization, office spreadsheets, PDF markup, and planning without recurring licenses.',
    replacesCommercial: ['AutoCAD', 'Autodesk Revit', 'Microsoft Office 365', 'Adobe Acrobat Pro', 'Microsoft Visio'],
    stages: [
      {
        stageAr: '1. الرسم الثنائي والمخططات 2D',
        stageEn: '1. 2D CAD Drafting',
        programId: 'librecad',
        programName: 'LibreCAD',
        roleAr: 'رسم المساقط والتفاصيل السريعة بصيغة DXF',
        roleEn: 'Fast 2D floor plans & DXF details',
        formats: ['DXF', 'PDF', 'SVG'],
      },
      {
        stageAr: '2. نمذجة المعلومات OpenBIM',
        stageEn: '2. OpenBIM Modeling',
        programId: 'bonsai-blenderbim',
        programName: 'Bonsai (BlenderBIM)',
        roleAr: 'نمذجة المباني بمعيار IFC الأصلي وإخراج اللوحات',
        roleEn: 'Native IFC BIM modeling & drawing sheets',
        formats: ['IFC', 'SVG', 'DXF'],
      },
      {
        stageAr: '3. المستندات وحصر الكميات',
        stageEn: '3. Docs & BOQ Spreadsheets',
        programId: 'libreoffice',
        programName: 'LibreOffice',
        roleAr: 'جداول الكميات والمقايسات والتقارير العربية RTL',
        roleEn: 'Bills of quantities, budgets, & Arabic RTL specs',
        formats: ['XLSX', 'DOCX', 'ODS', 'PDF'],
      },
      {
        stageAr: '4. تحرير ودمج مخططات PDF',
        stageEn: '4. PDF Sheets & Markup',
        programId: 'pdf24-creator',
        programName: 'PDF24 Creator',
        roleAr: 'ضغط اللوحات الكبيرة، الدمج، والتوقيع محلياً دون إنترنت',
        roleEn: 'Compress large drawing sets, merge & sign offline',
        formats: ['PDF'],
      },
      {
        stageAr: '5. خرائط التدفق وخطط BEP',
        stageEn: '5. BEP & Workflow Diagrams',
        programId: 'drawio',
        programName: 'draw.io (diagrams.net)',
        roleAr: 'رسم مخططات تنفيذ البيم والعمليات الإدارية',
        roleEn: 'BIM Execution Plan diagrams & org charts',
        formats: ['DRAWIO', 'VSDX', 'SVG'],
      },
    ],
    strengthsAr: [
      'صفر اشتراكات سنوية مع توافق عربي ممتاز في LibreOffice و PDF24 و LibreCAD',
      'اعتماد ملفات مفتوحة القياسية (IFC, DXF, ODT, PDF) تمنع احتكار البيانات',
    ],
    strengthsEn: [
      'Zero annual seat costs with strong Arabic RTL support in LibreOffice, PDF24, and LibreCAD',
      'Open file standards (IFC, DXF, ODT, PDF) prevent vendor lock-in',
    ],
    caveatsAr: [
      'التبادل المباشر لملفات DWG الحديثة جداً قد يتطلب حفظاً بصيغة DXF أو استخدام nanoCAD 5 Free',
      'تعاون العمل المتزامن (Worksharing) يختلف عن Revit Server ويعتمد تقسيم الملفات أو Speckle',
    ],
    caveatsEn: [
      'Latest DWG versions may require saving as DXF or pairing with nanoCAD 5 Free',
      'Multi-user worksharing relies on federated IFC files or Speckle rather than Revit Server',
    ],
    hardwareSummaryAr: 'يعمل بكفاءة على أجهزة 8GB RAM (ولـ Bonsai يوصى بـ 16GB RAM)',
    hardwareSummaryEn: 'Runs smoothly on 8GB RAM PCs (16GB RAM recommended for Bonsai)',
    minimumRamGb: 8,
  },
  {
    id: 'structural-engineer',
    titleAr: 'منظومة مهندس إنشائي',
    titleEn: 'Structural Engineer Stack',
    audienceAr: 'لمن يقوم بالتحليل الإنشائي، النمذجة الخرسانية والمعدنية، وتوثيق التسليح',
    audienceEn: 'For structural analysis, finite element verification, steel/concrete modeling & calculation notes',
    summaryAr:
      'منظومة تجمع التحليل الإنشائي غير الخطي والعناصر المحدودة FEM مع مذكرات الحسابات الهندسية وتفاصيل حديد التسليح.',
    summaryEn:
      'Combines finite element structural analysis, nonlinear earthquake engineering, calculation sheets, and BIM rebar detailing.',
    replacesCommercial: ['CSI ETABS', 'CSI SAP2000', 'Autodesk Robot Structural', 'Tekla Structures', 'Mathcad'],
    stages: [
      {
        stageAr: '1. التحليل بالعناصر المحدودة FEM',
        stageEn: '1. Finite Element Analysis',
        programId: 'prepomax',
        programName: 'PrePoMax',
        roleAr: 'واجهة بصرية حديثة لمحرك CalculiX لتحليل الإجهادات والمنشآت',
        roleEn: 'Modern pre/post-processor for CalculiX FEA',
        formats: ['STEP', 'IGES', 'INP', 'VTK'],
      },
      {
        stageAr: '2. تحليل الزلازل والإطارات',
        stageEn: '2. Seismic & Frame Analysis',
        programId: 'opensees',
        programName: 'OpenSees',
        roleAr: 'محاكاة الاستجابة الزلزالية والسلوك غير الخطي للمنشآت',
        roleEn: 'Non-linear seismic & frame structural simulation',
        formats: ['TCL', 'PY', 'JSON'],
      },
      {
        stageAr: '3. النمذجة الإنشائية وحصر التسليح',
        stageEn: '3. Structural BIM & Rebar',
        programId: 'freecad-reinforcement',
        programName: 'FreeCAD Reinforcement',
        roleAr: 'نمذجة الكمرات والأعمدة وتوليد قوائم تفريد الحديد BBS',
        roleEn: 'Parametric concrete framing & rebar BBS generation',
        formats: ['FCStd', 'IFC', 'STEP'],
      },
      {
        stageAr: '4. مذكرات الحسابات الإنشائية',
        stageEn: '4. Engineering Calc Sheets',
        programId: 'calcpad',
        programName: 'Calcpad',
        roleAr: 'إنشاء مذكرات حسابية مهندسة بصيغة HTML/Word بالمعادلات',
        roleEn: 'Automated structural calculation reports with rendered math',
        formats: ['CPD', 'HTML', 'DOCX', 'PDF'],
      },
    ],
    strengthsAr: [
      'أدوات موثقة أكاديمياً وصناعياً (OpenSees من جامعة بيركلي و CalculiX و Calcpad)',
      'تصدير مباشر لمذكرات الحساب بصيغ قابلة للمراجعة والطباعة',
    ],
    strengthsEn: [
      'Academically and industry-validated solvers (UC Berkeley OpenSees, CalculiX, Calcpad)',
      'Clean printable calculation notes in HTML and DOCX',
    ],
    caveatsAr: [
      'تطبيق أكواد التصميم المحلية الآلي (مثل ACI/Eurocode داخل ETABS) يتطلب بناء قوالب Calcpad أو سكربتات Python',
      'لوحات الـ Shop Drawings المعدنية المعقدة لا تضاهي سرعة Tekla Structures الكاملة بعد',
    ],
    caveatsEn: [
      'Automated code-check design (ACI/EC2 like ETABS) requires Calcpad templates or custom Python checks',
      'Complex steel shop-drawing automation does not yet match full Tekla Structures speed',
    ],
    hardwareSummaryAr: '8GB–16GB RAM · OpenSees و Calcpad خفيفان جداً على المعالج',
    hardwareSummaryEn: '8GB–16GB RAM · OpenSees and Calcpad run lightly on standard CPUs',
    minimumRamGb: 8,
  },
  {
    id: 'mep-engineer',
    titleAr: 'منظومة مهندس MEP',
    titleEn: 'MEP Engineer Stack',
    audienceAr: 'لمهندسي الميكانيكا والكهرباء والصحي وتنسيق الأنظمة والطاقة',
    audienceEn: 'For HVAC, lighting, stormwater, electrical CAD, and energy simulation engineers',
    summaryAr:
      'تجمع أدوات محاكاة أحمال الطاقة HVAC، تصميم الإضاءة DIALux، شبكات الصرف، وتنسيق تعارضات MEP عبر IFC.',
    summaryEn:
      'Integrates HVAC energy modeling, lighting calculations, stormwater networks, CAD drafting, and IFC MEP clash coordination.',
    replacesCommercial: ['Autodesk Revit MEP', 'AGI32', 'IES VE', 'Autodesk InfoDrainage', 'Navisworks'],
    stages: [
      {
        stageAr: '1. نمذجة مسارات MEP و IFC',
        stageEn: '1. MEP BIM & IFC Modeling',
        programId: 'bonsai-blenderbim',
        programName: 'Bonsai (BlenderBIM)',
        roleAr: 'نمذجة وتوثيق الأنظمة وتبادل ملفات IFC مع المعماري',
        roleEn: 'OpenBIM MEP modeling & IFC coordination',
        formats: ['IFC', 'DXF', 'BCF'],
      },
      {
        stageAr: '2. حسابات الطاقة والتكييف',
        stageEn: '2. Energy & HVAC Simulation',
        programId: 'openstudio-equest',
        programName: 'OpenStudio / EnergyPlus',
        roleAr: 'حساب الأحمال الحرارية ومحاكاة استهلاك الطاقة للمباني',
        roleEn: 'Whole-building thermal loads & EnergyPlus simulation',
        formats: ['OSM', 'IDF', 'GBXML', 'IFC'],
      },
      {
        stageAr: '3. تصميم الإضاءة المعمارية',
        stageEn: '3. Lighting Calculation',
        programId: 'dialux-evo',
        programName: 'DIALux evo',
        roleAr: 'حساب شدة الإضاءة وتوزيع الكشافات وتصدير التقارير',
        roleEn: 'Indoor/outdoor photometric lighting analysis',
        formats: ['EVO', 'DWG', 'IFC', 'IES'],
      },
      {
        stageAr: '4. شبكات الصرف والأمطار',
        stageEn: '4. Stormwater & Hydraulics',
        programId: 'epa-swmm',
        programName: 'EPA SWMM',
        roleAr: 'تحليل شبكات تصريف مياه الأمطار والهيدروليكا مجاناً',
        roleEn: 'Dynamic rainfall-runoff and pipe network modeling',
        formats: ['INP', 'RPT', 'CSV'],
      },
      {
        stageAr: '5. تنسيق ومراجعة التعارضات',
        stageEn: '5. MEP Clash Review',
        programId: 'bimcollab-zoom',
        programName: 'BIMcollab ZOOM',
        roleAr: 'دمج ملفات المعماري والإنشائي والـ MEP وإصدار ملاحظات BCF',
        roleEn: 'Federate Arch/Struct/MEP IFCs & issue BCF reports',
        formats: ['IFC', 'BCF'],
      },
    ],
    strengthsAr: [
      'تغطية مجانية كاملة لتخصصات الطاقة (EnergyPlus)، الإضاءة (DIALux)، والصرف (EPA SWMM)',
      'تكامل قوي في مرحلة المراجعة والتنسيق عبر IFC + BCF',
    ],
    strengthsEn: [
      'Authoritative free standards for energy (EnergyPlus), lighting (DIALux), and hydraulics (EPA SWMM)',
      'Strong federated coordination via IFC and BCF',
    ],
    caveatsAr: [
      'أتمتة موازنة الضغط والتوصيل التلقائي لشبكات الدكت والمواسير داخل Bonsai ما زالت في تطور مستمر مقارنة بـ Revit MEP',
    ],
    caveatsEn: [
      'Automated duct/pipe sizing and routing in Bonsai is still maturing compared to Revit MEP',
    ],
    hardwareSummaryAr: '8GB–16GB RAM · DIALux evo و Bonsai يستفيدان من كرت شاشة متوسط',
    hardwareSummaryEn: '8GB–16GB RAM · DIALux evo and Bonsai benefit from a mid-range GPU',
    minimumRamGb: 8,
  },
  {
    id: 'open-source-bim',
    titleAr: 'منظومة BIM مفتوحة المصدر',
    titleEn: 'Open-Source BIM Stack',
    audienceAr: 'لمنسقي ومديري الـ BIM ومكاتب معايير OpenBIM و ISO 19650',
    audienceEn: 'For BIM Coordinators, BIM Managers, and ISO 19650 OpenBIM workflows',
    summaryAr:
      'منظومة OpenBIM 100% تعتمد معيار buildingSMART (IFC و IDS و BCF) من النمذجة وحتى فحص الجودة وبيئة البيانات المشتركة.',
    summaryEn:
      '100% OpenBIM pipeline built around buildingSMART standards (IFC, IDS, BCF) from authoring to model checking and CDE sharing.',
    replacesCommercial: ['Autodesk Revit', 'Solibri Office', 'Autodesk ACC / BIM 360', 'Navisworks', 'Synchro 4D'],
    stages: [
      {
        stageAr: '1. التأليف الأصلي للـ IFC',
        stageEn: '1. Native IFC Authoring',
        programId: 'bonsai-blenderbim',
        programName: 'Bonsai (BlenderBIM)',
        roleAr: 'إنشاء وتعديل ملفات IFC مباشرة واللوحات التنفيذية وجدول 4D',
        roleEn: 'Native IFC authoring, sheets, and 4D scheduling',
        formats: ['IFC', 'SVG', 'DXF'],
      },
      {
        stageAr: '2. فحص البيانات بمعيار IDS',
        stageEn: '2. IDS Quality Checking',
        programId: 'ifctester-ids',
        programName: 'IfcTester (IDS)',
        roleAr: 'التحقق الآلي من مطابقة النموذج لمتطلبات المعلومات IDS',
        roleEn: 'Automated Information Delivery Specification auditing',
        formats: ['IFC', 'IDS', 'HTML'],
      },
      {
        stageAr: '3. فحص التعارضات والتنسيق',
        stageEn: '3. Coordination & BCF',
        programId: 'bimcollab-zoom',
        programName: 'BIMcollab ZOOM',
        roleAr: 'فحص النماذج المجمعة وإدارة قضايا التنسيق BCF',
        roleEn: 'Federated IFC checking & BCF issue management',
        formats: ['IFC', 'BCF'],
      },
      {
        stageAr: '4. مشاركة البيانات السحابية CDE',
        stageEn: '4. Open Data Exchange CDE',
        programId: 'speckle-bim',
        programName: 'Speckle',
        roleAr: 'منصة سحابية مفتوحة المصدر لمشاركة النماذج وإصداراتها عبر المتصفح',
        roleEn: 'Open-source 3D data platform, versioning & web viewer',
        formats: ['IFC', 'RVT', 'OBJ', 'JSON'],
      },
      {
        stageAr: '5. أتمتة البيانات ببايثون',
        stageEn: '5. Python IFC Automation',
        programId: 'ifcopenshell',
        programName: 'IfcOpenShell',
        roleAr: 'قراءة وتعديل وحصر آلاف العناصر البرمجية في IFC',
        roleEn: 'Programmatic IFC parsing, editing, and quantity takeoff',
        formats: ['IFC', 'PY', 'CSV'],
      },
    ],
    strengthsAr: [
      'متوافقة بالكامل مع معايير ISO 19650 و buildingSMART OpenBIM',
      'لا تتطلب أي اشتراكات مغلقة لقراءة أو تدقيق نماذج المشروع',
    ],
    strengthsEn: [
      'Aligned with ISO 19650 and buildingSMART OpenBIM standards',
      'Zero proprietary license barrier for reading or auditing project data',
    ],
    caveatsAr: [
      'تتطلب تدريب الفريق على مفاهيم IFC Schema و IDS بدلاً من الاعتماد على خصائص Revit الخاصة فقط',
    ],
    caveatsEn: [
      'Requires team familiarity with IFC schemas and IDS instead of proprietary Revit parameters alone',
    ],
    hardwareSummaryAr: '16GB RAM موصى بها للنماذج المجمعة · Speckle و IfcTester يعملان على أجهزة متوسطة',
    hardwareSummaryEn: '16GB RAM recommended for federated models · Speckle & IfcTester run lightly',
    minimumRamGb: 8,
  },
  {
    id: 'interior-design',
    titleAr: 'منظومة تصميم داخلي',
    titleEn: 'Interior Design Stack',
    audienceAr: 'لمصممي الديكور الداخلي والفرش المعماري والإظهار الواقعي',
    audienceEn: 'For interior architects, furniture modelers, material artists, and arch-viz specialists',
    summaryAr:
      'بديل متكامل لـ 3ds Max + V-Ray + SketchUp + Photoshop يغطي التصميم السريع، النمذجة التفصيلية، الرندر الواقعي، وتعديل الصور.',
    summaryEn:
      'Complete alternative to 3ds Max + V-Ray + SketchUp + Photoshop covering fast layouts, detailed modeling, real-time rendering, and post-production.',
    replacesCommercial: ['Autodesk 3ds Max', 'SketchUp Pro', 'Lumion Pro', 'Adobe Photoshop'],
    stages: [
      {
        stageAr: '1. التخطيط السريع للفرش',
        stageEn: '1. Rapid Interior Layout',
        programId: 'sweet-home-3d',
        programName: 'Sweet Home 3D',
        roleAr: 'توزيع الأثاث والغرف بسهولة فائقة للعملاء والمبتدئين',
        roleEn: 'Fast 2D-to-3D furniture and room layout planning',
        formats: ['SH3D', 'OBJ', 'SVG'],
      },
      {
        stageAr: '2. النمذجة والإظهار الاحترافي',
        stageEn: '2. Detailed 3D & Cycles Render',
        programId: 'blender',
        programName: 'Blender',
        roleAr: 'تصميم الأثاث المخصص، الإضاءة الداخلية، والرندر بـ Cycles',
        roleEn: 'Custom furniture modeling, lighting & Cycles photorealism',
        formats: ['BLEND', 'FBX', 'OBJ', 'GLTF'],
      },
      {
        stageAr: '3. التجول الافتراضي والرندر الفوري',
        stageEn: '3. Real-Time Walkthroughs',
        programId: 'twinmotion-community',
        programName: 'Twinmotion Community',
        roleAr: 'إنتاج صور وفيديوهات تفاعلية للعملاء بسرعة فائقة',
        roleEn: 'Instant client walkthroughs and video renders',
        formats: ['TM', 'FBX', 'GLTF'],
      },
      {
        stageAr: '4. المعالجة البصرية Post-Production',
        stageEn: '4. Render Post-Production',
        programId: 'photopea',
        programName: 'Photopea',
        roleAr: 'تحسين الألوان وإضافة اللمسات النهائية من المتصفح بواجهة تشبه Photoshop',
        roleEn: 'Browser-based PSD compositing & color finishing',
        formats: ['PSD', 'PNG', 'JPG'],
      },
    ],
    strengthsAr: [
      'Blender + Cycles ينتج جودة صور واقعية تضاهي V-Ray و Corona مع مكتبات خامات مجانية مثل PolyHaven',
      'Sweet Home 3D مثالي لعرض التعديلات السريعة أمام العميل على أي جهاز ضعيف',
    ],
    strengthsEn: [
      'Blender Cycles delivers photorealism rivaling V-Ray/Corona with free asset ecosystems',
      'Sweet Home 3D runs on modest laptops for quick client layout iterations',
    ],
    caveatsAr: [
      'الانتقال من مكتبات 3ds Max الجاهزة يتطلب بناء مكتبة خامات وقطع أثاث بصيغ BLEND أو glTF',
    ],
    caveatsEn: [
      'Moving off legacy .max furniture packs requires converting or curating BLEND/glTF asset libraries',
    ],
    hardwareSummaryAr: '16GB RAM وكرت شاشة مخصص 6GB+ VRAM موصى بهما للرندر السريع في Blender/Twinmotion',
    hardwareSummaryEn: '16GB RAM & 6GB+ VRAM GPU recommended for fast Cycles/Twinmotion rendering',
    minimumRamGb: 8,
  },
  {
    id: 'construction-pm',
    titleAr: 'منظومة إدارة مشاريع إنشائية',
    titleEn: 'Construction Project Management Stack',
    audienceAr: 'لمهندسي التخطيط والتحكم في المشاريع ومديري التنفيذ والموقع',
    audienceEn: 'For Planning Engineers, Project Controls, PMO, and Site Managers',
    summaryAr:
      'بديل عملي لحزم Primavera و MS Project و Visio يغطي الجدول الزمني، المسار الحرج، متابعة المهام، والتكامل الزمني 4D.',
    summaryEn:
      'Practical workflow covering CPM scheduling, resource tracking, collaborative PMO boards, 4D BIM sequencing, and technical diagrams.',
    replacesCommercial: ['Oracle Primavera P6', 'Microsoft Project', 'Synchro 4D', 'Microsoft Visio'],
    stages: [
      {
        stageAr: '1. الجدول الزمني والمسار الحرج',
        stageEn: '1. CPM Scheduling',
        programId: 'projectlibre',
        programName: 'ProjectLibre',
        roleAr: 'بناء الجداول الزمنية ومخططات Gantt وحساب القيمة المكتسبة EVM',
        roleEn: 'Gantt charts, critical path, & Earned Value (EVM)',
        formats: ['POD', 'MPP', 'XML'],
      },
      {
        stageAr: '2. إدارة محفظة المشاريع والفرق',
        stageEn: '2. Team & PMO Workspace',
        programId: 'openproject',
        programName: 'OpenProject',
        roleAr: 'متابعة المهام، المخاطر، حزم العمل WBS، والاجتماعات',
        roleEn: 'WBS tracking, BIM integration, risks & team boards',
        formats: ['CSV', 'PDF', 'IFC'],
      },
      {
        stageAr: '3. ربط الجدول الزمني بالنموذج 4D',
        stageEn: '3. 4D BIM Sequencing',
        programId: 'bonsai-4d',
        programName: 'Bonsai 4D / IfcOpenShell',
        roleAr: 'ربط أنشطة الجدول الزمني بعناصر الـ IFC لمحاكاة مراحل البناء',
        roleEn: 'Link construction schedule tasks directly to IFC elements',
        formats: ['IFC', 'XML', 'CSV'],
      },
      {
        stageAr: '4. خرائط الأسلوب والعمليات',
        stageEn: '4. Method Statements & Charts',
        programId: 'drawio',
        programName: 'draw.io (diagrams.net)',
        roleAr: 'إعداد الهيكل التنظيمي ومخططات خطط العمل الميداني',
        roleEn: 'Org charts, logistics plans & method flowcharts',
        formats: ['DRAWIO', 'VSDX', 'PDF'],
      },
    ],
    strengthsAr: [
      'يقرأ ProjectLibre ملفات MS Project (MPP) دون اشتراك ويوفر القيمة المكتسبة EVM',
      'OpenProject يدعم ربط نماذج IFC في نسخته المتكاملة للفرق الهندسية',
    ],
    strengthsEn: [
      'ProjectLibre opens MS Project (.mpp) files without license fees and supports EVM',
      'OpenProject offers structured WBS and IFC coordination modules',
    ],
    caveatsAr: [
      'ملفات Primavera P6 المغلقة (.xer) تحتاج تصديراً إلى XML أو CSV من P6 قبل فتحها في ProjectLibre',
    ],
    caveatsEn: [
      'Proprietary Primavera .xer files should be exported as XML/CSV from P6 before opening in ProjectLibre',
    ],
    hardwareSummaryAr: '4GB–8GB RAM · جميع الأدوات خفيفة وتعمل على الحواسيب الاقتصادية',
    hardwareSummaryEn: '4GB–8GB RAM · Lightweight tools suitable for standard office laptops',
    minimumRamGb: 4,
  },
  {
    id: 'engineering-content',
    titleAr: 'منظومة إنتاج المحتوى الهندسي',
    titleEn: 'Engineering Content Creation Stack',
    audienceAr: 'للمحاضرين والمدربين وصناع الشروحات الهندسية والدورات التقنية',
    audienceEn: 'For BIM instructors, technical educators, and engineering YouTube creators',
    summaryAr:
      'تشكيلة أدوات مجانية عالية الجودة لتسجيل شاشة البرامج الهندسية، مونتاج الدورات بدقة 4K، تنقية الصوت، وتصميم الشرائح والرسوم التوضيحية.',
    summaryEn:
      'Studio-grade free toolkit for recording CAD/BIM screen tutorials, editing 4K lessons, audio cleanup, and crafting technical vector diagrams.',
    replacesCommercial: ['TechSmith Camtasia', 'Adobe Premiere Pro', 'Adobe Audition', 'Adobe Illustrator'],
    stages: [
      {
        stageAr: '1. تسجيل الشاشة والشرح',
        stageEn: '1. Screen & Mic Recording',
        programId: 'obs-studio',
        programName: 'OBS Studio',
        roleAr: 'تسجيل شاشة بدقة عالية مع فصل مسارات الميكروفون والصوت',
        roleEn: 'Lossless screen recording with multi-track audio',
        formats: ['MKV', 'MP4'],
      },
      {
        stageAr: '2. مونتاج الشروحات والدورات',
        stageEn: '2. Video Editing & Color',
        programId: 'kdenlive',
        programName: 'Kdenlive',
        roleAr: 'قص ومونتاج سريع بواجهة عربية وتأثيرات التكبير للشرح',
        roleEn: 'Fast timeline editing with Arabic UI & zoom keyframes',
        formats: ['KDENLIVE', 'MP4', 'MKV'],
      },
      {
        stageAr: '3. تنقية الصوت الهندسي',
        stageEn: '3. Audio Cleanup',
        programId: 'audacity',
        programName: 'Audacity',
        roleAr: 'إزالة الضوضاء وضبط مستوى صوت الشرح',
        roleEn: 'Noise reduction, EQ, and loudness normalization',
        formats: ['WAV', 'MP3', 'FLAC'],
      },
      {
        stageAr: '4. تصميم الرسوم التوضيحية والواجهات',
        stageEn: '4. Vector Diagrams & Thumbnails',
        programId: 'inkscape',
        programName: 'Inkscape',
        roleAr: 'إعداد المخططات والصور المصغرة بصيغ SVG و PNG',
        roleEn: 'Clean technical diagrams & vector graphics',
        formats: ['SVG', 'PDF', 'PNG'],
      },
    ],
    strengthsAr: [
      'مجانية 100% دون أي علامة مائية (Watermark) حتى في دقة 4K',
      'دعم كامل للواجهة العربية في OBS Studio و Kdenlive و Inkscape',
    ],
    strengthsEn: [
      'Zero watermarks or duration caps up to 4K 60fps',
      'Full Arabic UI support across OBS Studio, Kdenlive, and Inkscape',
    ],
    caveatsAr: [
      'لمشاريع المونتاج السينمائية الثقيلة جداً يمكن الترقية إلى DaVinci Resolve المجاني بدلاً من Kdenlive',
    ],
    caveatsEn: [
      'For heavy 4K color grading workflows, DaVinci Resolve (Free) can substitute Kdenlive',
    ],
    hardwareSummaryAr: '8GB RAM لـ OBS + Kdenlive · 16GB RAM لمشاريع 4K الطويلة',
    hardwareSummaryEn: '8GB RAM for 1080p tutorials · 16GB RAM for long 4K timelines',
    minimumRamGb: 8,
  },
];

/* ============================================================================
 * 2. TASK-BASED DISCOVERY (ميزة: ماذا تريد أن تنجز؟ — 10 مهام هندسية)
 * ============================================================================ */

export interface EngineeringTask {
  id: string;
  titleAr: string;
  titleEn: string;
  shortDescAr: string;
  shortDescEn: string;
  primaryProgramId: string;
  primaryProgramName: string;
  supportingProgramIds: string[];
  commercialCounterpartId: string;
  commercialCounterpartName: string;
  recommendedCategory: SoftwareCategory;
  searchKeyword: string;
  keyFormats: string[];
  workflowTipAr: string;
  workflowTipEn: string;
  sampleCompatibilityFlowId: string;
}

export const ENGINEERING_TASKS: EngineeringTask[] = [
  {
    id: 'task-bim-model',
    titleAr: 'إنشاء نموذج BIM لمبنى',
    titleEn: 'Create a Building BIM Model',
    shortDescAr: 'نمذجة العناصر المعمارية والإنشائية مع البيانات والكميات واللوحات.',
    shortDescEn: 'Author architectural/structural building elements, quantities, and drawings.',
    primaryProgramId: 'bonsai-blenderbim',
    primaryProgramName: 'Bonsai (BlenderBIM)',
    supportingProgramIds: ['freecad-bim', 'bimcollab-zoom'],
    commercialCounterpartId: 'autodesk-revit',
    commercialCounterpartName: 'Autodesk Revit',
    recommendedCategory: 'bim-engineering',
    searchKeyword: 'BIM',
    keyFormats: ['IFC', 'DXF', 'SVG'],
    workflowTipAr: 'ابدأ بـ Bonsai إذا أردت عملاً أصلياً على ملفات IFC، أو FreeCAD للنمذجة البارامترية.',
    workflowTipEn: 'Choose Bonsai for native IFC authoring, or FreeCAD BIM for parametric geometry.',
    sampleCompatibilityFlowId: 'revit-to-bonsai-ifc',
  },
  {
    id: 'task-2d-drawings',
    titleAr: 'رسم مخططات 2D',
    titleEn: 'Draft 2D CAD Drawings',
    shortDescAr: 'إعداد المساقط الأفقية، القطاعات، والتفاصيل التنفيذية للطباعة بمقياس رسم.',
    shortDescEn: 'Create floor plans, sections, and scaled shop drawings.',
    primaryProgramId: 'librecad',
    primaryProgramName: 'LibreCAD',
    supportingProgramIds: ['qcad', 'nanocad-free'],
    commercialCounterpartId: 'autocad',
    commercialCounterpartName: 'AutoCAD',
    recommendedCategory: 'bim-engineering',
    searchKeyword: 'DWG',
    keyFormats: ['DXF', 'DWG', 'PDF'],
    workflowTipAr: 'استخدم LibreCAD أو QCAD للـ DXF السريع والخفيف، أو nanoCAD 5 Free للتعامل المباشر مع DWG.',
    workflowTipEn: 'Use LibreCAD or QCAD for lightweight DXF drafting, or nanoCAD 5 Free for native DWG.',
    sampleCompatibilityFlowId: 'autocad-to-librecad-dwg',
  },
  {
    id: 'task-structural-analysis',
    titleAr: 'تحليل وتصميم المنشآت',
    titleEn: 'Structural Analysis & Design',
    shortDescAr: 'تحليل الإجهادات بالعناصر المحدودة FEM والزلازل وتوثيق المذكرات الحسابية.',
    shortDescEn: 'Run finite element, seismic frame simulation, and calculation sheets.',
    primaryProgramId: 'prepomax',
    primaryProgramName: 'PrePoMax',
    supportingProgramIds: ['opensees', 'calcpad', 'freecad-reinforcement'],
    commercialCounterpartId: 'csi-etabs',
    commercialCounterpartName: 'CSI ETABS',
    recommendedCategory: 'bim-engineering',
    searchKeyword: 'FEM',
    keyFormats: ['STEP', 'INP', 'IFC'],
    workflowTipAr: 'اجمع بين PrePoMax/OpenSees للتحليل، و Calcpad لتوثيق المعادلات، و FreeCAD لتفريد التسليح.',
    workflowTipEn: 'Combine PrePoMax/OpenSees for solving with Calcpad for transparent engineering sheets.',
    sampleCompatibilityFlowId: 'freecad-to-prepomax-step',
  },
  {
    id: 'task-arch-viz',
    titleAr: 'إظهار معماري واقعي',
    titleEn: 'Photorealistic Architectural Rendering',
    shortDescAr: 'إنتاج لقطات وفيديوهات واقعية للإضاءة والمواد واللقطات الداخلية والخارجية.',
    shortDescEn: 'Render realistic interior/exterior lighting, materials, and client walkthroughs.',
    primaryProgramId: 'blender',
    primaryProgramName: 'Blender',
    supportingProgramIds: ['twinmotion-community', 'd5-render-community'],
    commercialCounterpartId: 'lumion',
    commercialCounterpartName: 'Lumion Pro',
    recommendedCategory: 'design',
    searchKeyword: 'إظهار',
    keyFormats: ['FBX', 'GLTF', 'OBJ', 'BLEND'],
    workflowTipAr: 'استخدم Twinmotion للسرعة والمزامنة الحية، و Blender Cycles لأعلى واقعية مجانية دون قيود.',
    workflowTipEn: 'Use Twinmotion for rapid real-time walkthroughs, or Blender Cycles for pure open photorealism.',
    sampleCompatibilityFlowId: 'revit-to-twinmotion-fbx',
  },
  {
    id: 'task-clash-detection',
    titleAr: 'كشف التعارضات بين النماذج',
    titleEn: 'Model Coordination & Clash Detection',
    shortDescAr: 'دمج نماذج المعماري والإنشائي والـ MEP ومراجعة التعارضات وملاحظات BCF.',
    shortDescEn: 'Federate discipline IFC models, inspect clashes, and track BCF issues.',
    primaryProgramId: 'bimcollab-zoom',
    primaryProgramName: 'BIMcollab ZOOM',
    supportingProgramIds: ['bimvision', 'ifctester-ids'],
    commercialCounterpartId: 'navisworks',
    commercialCounterpartName: 'Autodesk Navisworks',
    recommendedCategory: 'bim-engineering',
    searchKeyword: 'IFC',
    keyFormats: ['IFC', 'BCF', 'IDS'],
    workflowTipAr: 'صدّر التخصصات بصيغة IFC4 وافتحها مجتمعة داخل BIMcollab ZOOM أو BIMvision.',
    workflowTipEn: 'Export all disciplines to IFC4 and federate them inside BIMcollab ZOOM or BIMvision.',
    sampleCompatibilityFlowId: 'revit-to-bimcollab-ifc',
  },
  {
    id: 'task-4d-schedule',
    titleAr: 'إنشاء جدول زمني 4D',
    titleEn: 'Create a 4D Construction Schedule',
    shortDescAr: 'بناء الجدول الزمني المسار الحرج وربطه بعناصر المبنى ثلاثية الأبعاد.',
    shortDescEn: 'Build CPM schedules and link construction tasks to 3D BIM elements.',
    primaryProgramId: 'bonsai-4d',
    primaryProgramName: 'Bonsai 4D Scheduling',
    supportingProgramIds: ['projectlibre', 'openproject'],
    commercialCounterpartId: 'synchro-4d',
    commercialCounterpartName: 'Bentley Synchro 4D',
    recommendedCategory: 'bim-engineering',
    searchKeyword: '4D',
    keyFormats: ['IFC', 'XML', 'MPP'],
    workflowTipAr: 'أعدّ الجدول الزمني في ProjectLibre ثم اربط المهام بعناصر IFC داخل Bonsai 4D.',
    workflowTipEn: 'Draft tasks in ProjectLibre, then link them to IFC building elements in Bonsai 4D.',
    sampleCompatibilityFlowId: 'primavera-to-projectlibre-xer',
  },
  {
    id: 'task-energy-sustainability',
    titleAr: 'تحليل الطاقة والاستدامة',
    titleEn: 'Energy & Sustainability Analysis',
    shortDescAr: 'محاكاة الأحمال الحرارية، الإشعاع الشمسي، الظلال، وكفاءة استهلاك الطاقة.',
    shortDescEn: 'Simulate thermal loads, solar radiation, daylighting, and building energy.',
    primaryProgramId: 'openstudio-equest',
    primaryProgramName: 'OpenStudio / EnergyPlus',
    supportingProgramIds: ['ladybug-tools', 'dialux-evo'],
    commercialCounterpartId: 'ies-ve-designbuilder',
    commercialCounterpartName: 'IES VE / DesignBuilder',
    recommendedCategory: 'ai-tools',
    searchKeyword: 'طاقة',
    keyFormats: ['OSM', 'IDF', 'GBXML', 'EPW'],
    workflowTipAr: 'يعتمد OpenStudio على محرك EnergyPlus الحكومي الأمريكي القياسي ومجاني تماماً.',
    workflowTipEn: 'OpenStudio runs the US DOE standard EnergyPlus engine completely free.',
    sampleCompatibilityFlowId: 'revit-to-bonsai-ifc',
  },
  {
    id: 'task-point-cloud',
    titleAr: 'تحويل سحابة نقاط إلى نموذج 3D',
    titleEn: 'Point Cloud to 3D Model',
    shortDescAr: 'معالجة ملفات المسح الليزري E57/LAS أو الصور وتحويلها لشبكات ونماذج قياسية.',
    shortDescEn: 'Process laser scan E57/LAS clouds or photogrammetry photos into 3D meshes.',
    primaryProgramId: 'cloudcompare',
    primaryProgramName: 'CloudCompare',
    supportingProgramIds: ['meshroom', 'blender'],
    commercialCounterpartId: 'point-layout-matterport',
    commercialCounterpartName: 'Autodesk ReCap / Matterport',
    recommendedCategory: 'bim-engineering',
    searchKeyword: 'سحابة',
    keyFormats: ['E57', 'LAS', 'LAZ', 'PLY', 'OBJ'],
    workflowTipAr: 'نظّف سحابة النقاط وقم بمحاذاة الطبقات في CloudCompare ثم انقلها إلى Blender أو Bonsai.',
    workflowTipEn: 'Filter and align scans in CloudCompare, then model As-Built elements in Blender/Bonsai.',
    sampleCompatibilityFlowId: 'cloudcompare-to-blender-e57',
  },
  {
    id: 'task-manage-ifc',
    titleAr: 'إدارة ملفات IFC',
    titleEn: 'Manage, Audit & Parse IFC Files',
    shortDescAr: 'فحص جودة البيانات، استخراج الجداول، تقسيم النماذج، وتطبيق قواعد IDS.',
    shortDescEn: 'Validate IFC schemas, run IDS audits, split models, and extract data.',
    primaryProgramId: 'ifcopenshell',
    primaryProgramName: 'IfcOpenShell',
    supportingProgramIds: ['ifctester-ids', 'speckle-bim', 'bimvision'],
    commercialCounterpartId: 'solibri-office',
    commercialCounterpartName: 'Solibri Office',
    recommendedCategory: 'bim-engineering',
    searchKeyword: 'IFC',
    keyFormats: ['IFC', 'IDS', 'JSON', 'CSV'],
    workflowTipAr: 'استخدم IfcTester لفحص قواعد IDS بدون برمجة، أو IfcOpenShell لأتمتة التعديلات بالبايثون.',
    workflowTipEn: 'Use IfcTester for no-code IDS validation, or IfcOpenShell for Python batch editing.',
    sampleCompatibilityFlowId: 'revit-to-bonsai-ifc',
  },
  {
    id: 'task-ai-arch-design',
    titleAr: 'توليد تصميم معماري بالذكاء الاصطناعي',
    titleEn: 'AI-Assisted Architectural Concepting',
    shortDescAr: 'توليد أفكار كتلية ومفاهيم واجهات محلياً على جهازك باستخدام ComfyUI و Ollama.',
    shortDescEn: 'Generate facade studies, architectural renders & specs locally using ComfyUI & Ollama.',
    primaryProgramId: 'comfyui',
    primaryProgramName: 'ComfyUI',
    supportingProgramIds: ['krita-ai', 'blender-ai-render', 'ollama'],
    commercialCounterpartId: 'autodesk-forma',
    commercialCounterpartName: 'Autodesk Forma',
    recommendedCategory: 'ai-tools',
    searchKeyword: 'ذكاء اصطناعي',
    keyFormats: ['PNG', 'JSON', 'BLEND'],
    workflowTipAr: 'استخدم ControlNet داخل ComfyUI أو Krita AI لتحويل الاسكتشات المعمارية إلى مقترحات تصميمية محلياً.',
    workflowTipEn: 'Pair ControlNet in ComfyUI or Krita AI with massing screenshots for local design studies.',
    sampleCompatibilityFlowId: 'revit-to-twinmotion-fbx',
  },
];

/* ============================================================================
 * 3. REPLACEMENT READINESS ASSESSMENTS (هل تستطيع الاستغناء عن البرنامج المدفوع؟)
 * ============================================================================ */

export const REPLACEMENT_ASSESSMENTS: Record<string, ReplacementAssessment> = {
  'bonsai-blenderbim': {
    targetCommercialId: 'autodesk-revit',
    targetCommercialName: 'Autodesk Revit',
    tier: 'most-tasks',
    illustrativePercent: 70,
    basisNoteAr: 'نسبة توافق توضيحية وليست نتيجة اختبار فعلي · مبنية على مقارنة وظائف نمذجة BIM وتأليف IFC',
    basisNoteEn: 'Illustrative compatibility figure, not a lab benchmark · Based on BIM & OpenBIM authoring scope',
    functionRows: [
      { fnAr: 'نمذجة BIM', fnEn: 'BIM Modeling', status: 'جيد', noteAr: 'عناصر معمارية وإنشائية متقدمة', noteEn: 'Solid architectural & structural authoring' },
      { fnAr: 'IFC / OpenBIM', fnEn: 'IFC / OpenBIM', status: 'ممتاز', noteAr: 'تنسيق أصلي مباشر بدون تحويل', noteEn: 'Native IFC schema authoring without lossy export' },
      { fnAr: 'العائلات (Families)', fnEn: 'Families / Types', status: 'مختلف', noteAr: 'يعتمد IfcTypeObject بدلاً من RFA', noteEn: 'Uses IfcTypeObject instead of .rfa families' },
      { fnAr: 'العمل الجماعي (Worksharing)', fnEn: 'Worksharing', status: 'محدود', noteAr: 'محدود مقارنة بـ Revit (يعتمد Git / Speckle)', noteEn: 'Limited vs Revit Central Model (uses Git / Speckle)' },
      { fnAr: 'التوثيق واللوحات', fnEn: 'Documentation', status: 'يحتاج تقييم', noteAr: 'يحتاج تقييم حسب حجم المشروع وتعقيده', noteEn: 'Project-dependent setup for SVG/DXF sheets' },
    ],
  },
  'freecad-bim': {
    targetCommercialId: 'autodesk-revit',
    targetCommercialName: 'Autodesk Revit',
    tier: 'single-task',
    illustrativePercent: 52,
    basisNoteAr: 'نسبة توافق توضيحية وليست نتيجة اختبار فعلي · مناسب للمشاريع الصغيرة والنمذجة البارامترية',
    basisNoteEn: 'Illustrative compatibility figure, not a lab benchmark · Best for small buildings & parametric parts',
    functionRows: [
      { fnAr: 'نمذجة BIM', fnEn: 'BIM Modeling', status: 'جيد', noteAr: 'نمذجة بارامترية دقيقة للمباني الصغيرة', noteEn: 'Precise parametric geometry for smaller projects' },
      { fnAr: 'IFC / OpenBIM', fnEn: 'IFC / OpenBIM', status: 'جيد', noteAr: 'استيراد وتصدير IFC عبر IfcOpenShell', noteEn: 'IFC import/export via IfcOpenShell' },
      { fnAr: 'العائلات (Families)', fnEn: 'Families', status: 'محدود', noteAr: 'مكتبة عناصر قياسية أصغر', noteEn: 'Smaller built-in architectural library' },
      { fnAr: 'العمل الجماعي (Worksharing)', fnEn: 'Worksharing', status: 'غير متوفر', noteAr: 'ملفات فردية بدون خادم مركزي', noteEn: 'Single-user file workflow' },
      { fnAr: 'التوثيق واللوحات', fnEn: 'Documentation', status: 'محدود', noteAr: 'لوحات TechDraw أساسية وبطيئة في المشاريع الكبرى', noteEn: 'TechDraw slows down on large multi-story sheets' },
    ],
  },
  librecad: {
    targetCommercialId: 'autocad',
    targetCommercialName: 'AutoCAD',
    tier: 'most-tasks',
    illustrativePercent: 74,
    basisNoteAr: 'نسبة توافق توضيحية وليست نتيجة اختبار فعلي · مخصص للرسم الهندسي 2D فقط',
    basisNoteEn: 'Illustrative compatibility figure, not a lab benchmark · Covers 2D drafting workflows only',
    functionRows: [
      { fnAr: 'الرسم الهندسي 2D', fnEn: '2D Drafting', status: 'ممتاز', noteAr: 'طبقات، كتل، تهشير، وأبعاد دقيقة', noteEn: 'Full layers, blocks, hatching, and dimensioning' },
      { fnAr: 'صيغة DWG', fnEn: 'DWG Compatibility', status: 'محدود', noteAr: 'يعتمد DXF أساساً وقراءة محدودة لـ DWG', noteEn: 'Native DXF; DWG import only for older versions' },
      { fnAr: 'النمذجة 3D', fnEn: '3D Modeling', status: 'غير متوفر', noteAr: '2D فقط', noteEn: 'Strictly 2D CAD' },
      { fnAr: 'الأتمتة (LISP)', fnEn: 'LISP / Scripting', status: 'غير متوفر', noteAr: 'لا يدعم AutoLISP', noteEn: 'No AutoLISP compatibility' },
      { fnAr: 'الطباعة والنشر', fnEn: 'Plotting & PDF', status: 'جيد', noteAr: 'تصدير PDF و SVG بمقاييس رسم دقيقة', noteEn: 'Clean scaled PDF/SVG export' },
    ],
  },
  qcad: {
    targetCommercialId: 'autocad',
    targetCommercialName: 'AutoCAD',
    tier: 'most-tasks',
    illustrativePercent: 72,
    basisNoteAr: 'نسبة توافق توضيحية وليست نتيجة اختبار فعلي · ممتاز للـ 2D السريع والمنظم',
    basisNoteEn: 'Illustrative compatibility figure, not a lab benchmark · Clean 2D drafting focus',
    functionRows: [
      { fnAr: 'الرسم الهندسي 2D', fnEn: '2D Drafting', status: 'ممتاز', noteAr: 'واجهة منظمة وأدوات تعديل سريعة', noteEn: 'Structured UI & precision snapping' },
      { fnAr: 'صيغة DWG', fnEn: 'DWG Compatibility', status: 'محدود', noteAr: 'نسخة Community تدعم DXF أساساً', noteEn: 'Community edition uses DXF primarily' },
      { fnAr: 'الأتمتة والبرمجة', fnEn: 'Scripting', status: 'جيد', noteAr: 'برمجة إضافات عبر ECMAScript/JS', noteEn: 'Extensible via JavaScript/ECMAScript' },
      { fnAr: 'الطباعة بمقياس رسم', fnEn: 'Scaled Printing', status: 'ممتاز', noteAr: 'معاينة طباعة وتخطيطات واضحة', noteEn: 'Clean viewport & print layout preview' },
    ],
  },
  'nanocad-free': {
    targetCommercialId: 'autocad',
    targetCommercialName: 'AutoCAD',
    tier: 'near-equivalent',
    illustrativePercent: 85,
    basisNoteAr: 'نسبة توافق توضيحية وليست نتيجة اختبار فعلي · مطابق تقريباً في أوامر 2D وملفات DWG',
    basisNoteEn: 'Illustrative compatibility figure, not a lab benchmark · High command & DWG parity in 2D',
    functionRows: [
      { fnAr: 'الرسم الهندسي 2D', fnEn: '2D Drafting', status: 'ممتاز', noteAr: 'أوامر واختصارات مطابقة لأوتوكاد', noteEn: 'Identical AutoCAD-style command line & shortcuts' },
      { fnAr: 'صيغة DWG الأصلية', fnEn: 'Native DWG', status: 'ممتاز', noteAr: 'قراءة وحفظ DWG مباشرة (حتى إصدار 2013 في النسخة المجانية)', noteEn: 'Native DWG read/write (up to DWG 2013 in v5 Free)' },
      { fnAr: 'الجداول والأبعاد', fnEn: 'Tables & Dimensions', status: 'جيد', noteAr: 'مناسب للوحات التنفيذية', noteEn: 'Production-ready 2D annotation' },
      { fnAr: 'النمذجة 3D المتقدمة', fnEn: 'Advanced 3D', status: 'محدود', noteAr: 'النسخة المجانية تركز على 2D', noteEn: 'Free v5 targets 2D CAD workflows' },
    ],
  },
  'bimcollab-zoom': {
    targetCommercialId: 'navisworks',
    targetCommercialName: 'Autodesk Navisworks',
    tier: 'most-tasks',
    illustrativePercent: 75,
    basisNoteAr: 'نسبة توافق توضيحية وليست نتيجة اختبار فعلي · ممتاز في التنسيق و IFC و BCF',
    basisNoteEn: 'Illustrative compatibility figure, not a lab benchmark · Strong IFC coordination & BCF',
    functionRows: [
      { fnAr: 'استعراض النماذج المجمعة', fnEn: 'Model Federation', status: 'ممتاز', noteAr: 'دمج سريع لملفات IFC الكبيرة', noteEn: 'Ultra-fast multi-discipline IFC federation' },
      { fnAr: 'إدارة الملاحظات BCF', fnEn: 'BCF Issue Tracking', status: 'ممتاز', noteAr: 'مبني أصلاً لتقارير التنسيق BCF', noteEn: 'Native BCF workflow out-of-the-box' },
      { fnAr: 'كشف التعارضات الآلي', fnEn: 'Clash Matrices', status: 'محدود', noteAr: 'القواعد الآلية الكاملة في نسخة Pro؛ الفحص البصري مجاني', noteEn: 'Automated clash rules require Pro; visual inspection is free' },
      { fnAr: 'محاكاة الزمن 4D', fnEn: '4D Timeliner', status: 'غير متوفر', noteAr: 'استخدم Bonsai 4D كبديل لـ 4D', noteEn: 'Use Bonsai 4D for timeline animation' },
    ],
  },
  bimvision: {
    targetCommercialId: 'navisworks',
    targetCommercialName: 'Autodesk Navisworks',
    tier: 'single-task',
    illustrativePercent: 60,
    basisNoteAr: 'نسبة توافق توضيحية وليست نتيجة اختبار فعلي · مخصص لمراجعة نماذج IFC والقياسات',
    basisNoteEn: 'Illustrative compatibility figure, not a lab benchmark · Focused on IFC viewing & measurement',
    functionRows: [
      { fnAr: 'فتح ودمج IFC', fnEn: 'Multi-IFC Viewing', status: 'ممتاز', noteAr: 'مجاني بالكامل مع دمج التخصصات', noteEn: 'Free multi-model IFC loading' },
      { fnAr: 'القياسات والحجوم', fnEn: 'Measurements & Quantities', status: 'جيد', noteAr: 'قياس أطوال، مساحات، وحجوم العناصر', noteEn: 'Built-in distance, area, and volume tools' },
      { fnAr: 'ملفات NWD / RVT', fnEn: 'NWD / RVT Native', status: 'غير متوفر', noteAr: 'يعمل عبر IFC فقط', noteEn: 'IFC workflow only' },
      { fnAr: 'محاكاة 4D / Clash', fnEn: '4D / Automated Clash', status: 'محدود', noteAr: 'تتوفر عبر إضافات مدفوعة اختيارية', noteEn: 'Optional paid plugins for clash automation' },
    ],
  },
  blender: {
    targetCommercialId: '3ds-max',
    targetCommercialName: 'Autodesk 3ds Max',
    tier: 'near-equivalent',
    illustrativePercent: 88,
    basisNoteAr: 'نسبة توافق توضيحية وليست نتيجة اختبار فعلي · بديل ناضج جداً في النمذجة والرندر',
    basisNoteEn: 'Illustrative compatibility figure, not a lab benchmark · Mature industry alternative',
    functionRows: [
      { fnAr: 'النمذجة 3D والـ UV', fnEn: '3D Modeling & UV', status: 'ممتاز', noteAr: 'أدوات نمذجة ونحت وModifiers كاملة', noteEn: 'Full polygon, sculpting, and modifier stack' },
      { fnAr: 'الإظهار الواقعي (Cycles)', fnEn: 'Photoreal Rendering', status: 'ممتاز', noteAr: 'Cycles يضاهي V-Ray و Corona مع تتبع الأشعة GPU', noteEn: 'Cycles GPU path tracing rivals V-Ray/Corona' },
      { fnAr: 'النمذجة البارامترية', fnEn: 'Geometry Nodes', status: 'ممتاز', noteAr: 'نظام عقد Geometry Nodes المدمج', noteEn: 'Built-in procedural Geometry Nodes' },
      { fnAr: 'ملفات .max الجاهزة', fnEn: 'Legacy .max Scenes', status: 'غير متوفر', noteAr: 'يتطلب التصدير من 3ds Max بصيغة FBX/glTF/USD', noteEn: 'Requires export as FBX, OBJ, or glTF' },
    ],
  },
  'twinmotion-community': {
    targetCommercialId: 'lumion',
    targetCommercialName: 'Lumion Pro',
    tier: 'near-equivalent',
    illustrativePercent: 86,
    basisNoteAr: 'نسبة توافق توضيحية وليست نتيجة اختبار فعلي · بديل فوري مبني على Unreal Engine 5',
    basisNoteEn: 'Illustrative compatibility figure, not a lab benchmark · Real-time UE5 arch-viz',
    functionRows: [
      { fnAr: 'الإظهار الفوري Real-Time', fnEn: 'Real-Time Render', status: 'ممتاز', noteAr: 'إضاءة Lumen وتتبع الأشعة Path Tracer', noteEn: 'Lumen GI and Path Tracer built-in' },
      { fnAr: 'الربط مع Revit و ArchiCAD', fnEn: 'Live BIM Sync', status: 'ممتاز', noteAr: 'مزامنة مباشرة عبر Datasmith', noteEn: 'Direct Datasmith live sync plugin' },
      { fnAr: 'مكتبة الأشجار والمواد', fnEn: 'Asset Library', status: 'ممتاز', noteAr: 'مكتبة Fab و Quixel Megascans مدمجة', noteEn: 'Integrated Fab & Megascans assets' },
      { fnAr: 'تراخيص الشركات الكبرى', fnEn: 'Enterprise Revenue Cap', status: 'مختلف', noteAr: 'مجاني حتى إيراد سنوي مليون دولار', noteEn: 'Free under $1M annual gross revenue' },
    ],
  },
  'freecad-partdesign': {
    targetCommercialId: 'solidworks',
    targetCommercialName: 'SolidWorks',
    tier: 'most-tasks',
    illustrativePercent: 72,
    basisNoteAr: 'نسبة توافق توضيحية وليست نتيجة اختبار فعلي · ممتاز للتصنيع والقطع الميكانيكية',
    basisNoteEn: 'Illustrative compatibility figure, not a lab benchmark · Strong parametric CAD & STEP',
    functionRows: [
      { fnAr: 'النمذجة البارامترية', fnEn: 'Parametric Parts', status: 'ممتاز', noteAr: 'بيئة Part Design و Sketcher مقيدة بالكامل', noteEn: 'Full constraint-based Sketcher & Part Design' },
      { fnAr: 'صيغ التصنيع STEP/IGES', fnEn: 'STEP / IGES / STL', status: 'ممتاز', noteAr: 'تبادل هندسي دقيق مع آلات CNC والطابعات', noteEn: 'Clean STEP/IGES geometry exchange' },
      { fnAr: 'التجميعات الكبيرة', fnEn: 'Large Assemblies', status: 'جيد', noteAr: 'بيئة Assembly المدمجة في v1.0 تحسنت كثيراً', noteEn: 'Built-in Assembly workbench improved in v1.0' },
      { fnAr: 'ملفات .SLDPRT الأصلية', fnEn: 'Native SolidWorks', status: 'غير متوفر', noteAr: 'يفتح STEP وليس ملفات SLDPRT بشجرة التاريخ', noteEn: 'Imports STEP geometry without feature tree' },
    ],
  },
  projectlibre: {
    targetCommercialId: 'primavera-p6',
    targetCommercialName: 'Oracle Primavera P6',
    tier: 'most-tasks',
    illustrativePercent: 68,
    basisNoteAr: 'نسبة توافق توضيحية وليست نتيجة اختبار فعلي · يغطي المسار الحرج وملفات MPP',
    basisNoteEn: 'Illustrative compatibility figure, not a lab benchmark · Covers CPM & MPP files',
    functionRows: [
      { fnAr: 'مخططات جانت والمسار الحرج', fnEn: 'Gantt & CPM', status: 'ممتاز', noteAr: 'دعم كامل للأنشطة والعلاقات والـ Baseline', noteEn: 'Full Gantt, dependencies, and baselines' },
      { fnAr: 'القيمة المكتسبة EVM', fnEn: 'Earned Value (EVM)', status: 'جيد', noteAr: 'حسابات التكلفة والأداء الأساسية', noteEn: 'Core SPI/CPI and WBS cost tracking' },
      { fnAr: 'فتح ملفات MS Project', fnEn: 'MPP Compatibility', status: 'ممتاز', noteAr: 'قراءة وحفظ مباشر لصيغ MPP و XML', noteEn: 'Opens and saves MS Project .mpp/.xml' },
      { fnAr: 'مشاريع +10,000 نشاط و .XER', fnEn: 'Enterprise P6 (.XER)', status: 'محدود', noteAr: 'يتطلب تصدير XML من P6 ولا يدعم قواعد بيانات المؤسسات الضخمة', noteEn: 'Requires XML export from P6; single-file desktop app' },
    ],
  },
  libreoffice: {
    targetCommercialId: 'microsoft-office',
    targetCommercialName: 'Microsoft Office 365',
    tier: 'near-equivalent',
    illustrativePercent: 90,
    basisNoteAr: 'نسبة توافق توضيحية وليست نتيجة اختبار فعلي · بديل يومي كامل للمكاتب الهندسية',
    basisNoteEn: 'Illustrative compatibility figure, not a lab benchmark · Full daily office replacement',
    functionRows: [
      { fnAr: 'المستندات والتقارير العربية', fnEn: 'Arabic RTL Documents', status: 'ممتاز', noteAr: 'دعم أصيل للعربية والتنسيق من اليمين لليسار', noteEn: 'Native RTL typography & Arabic formatting' },
      { fnAr: 'جداول الكميات Calc', fnEn: 'BOQ Spreadsheets', status: 'ممتاز', noteAr: 'دوال Excel والمعادلات المحاسبية والهندسية', noteEn: 'Compatible Excel formulas & pivot tables' },
      { fnAr: 'ملفات DOCX/XLSX المعقدة', fnEn: 'Complex MS Layouts', status: 'جيد', noteAr: 'دقيق في 95% من الملفات؛ ONLYOFFICE أقرب تنسيقاً', noteEn: 'High fidelity; pair with ONLYOFFICE for strict layout parity' },
      { fnAr: 'ماكرو VBA المعقد', fnEn: 'Complex VBA Macros', status: 'محدود', noteAr: 'بعض أكواد VBA الخاصة بـ Excel تحتاج تعديل', noteEn: 'Heavy Excel VBA macros may require adaptation' },
    ],
  },
  gimp: {
    targetCommercialId: 'adobe-photoshop',
    targetCommercialName: 'Adobe Photoshop',
    tier: 'most-tasks',
    illustrativePercent: 78,
    basisNoteAr: 'نسبة توافق توضيحية وليست نتيجة اختبار فعلي · قوي في تعديل الصور والـ Post-Production',
    basisNoteEn: 'Illustrative compatibility figure, not a lab benchmark · Strong photo & render editing',
    functionRows: [
      { fnAr: 'الطبقات والأقنعة والتنقيح', fnEn: 'Layers & Masks', status: 'ممتاز', noteAr: 'أدوات تحرير احترافية غير مقيدة', noteEn: 'Full layer, mask, and retouching suite' },
      { fnAr: 'ملفات PSD', fnEn: 'PSD Compatibility', status: 'جيد', noteAr: 'فتح وحفظ PSD للطبقات الأساسية', noteEn: 'Opens & exports standard PSD layers' },
      { fnAr: 'التعديل غير المتلف و CMYK', fnEn: 'Non-Destructive / CMYK', status: 'محدود', noteAr: 'يتحسن في GIMP 3.0 لكنه أقل مرونة من Smart Objects', noteEn: 'Improved in GIMP 3.0; fewer Smart Object workflows' },
      { fnAr: 'أدوات الذكاء التوليدي', fnEn: 'Generative Fill', status: 'غير متوفر', noteAr: 'متوفر عبر إضافات Stable Diffusion / Krita AI', noteEn: 'Available via Krita AI Diffusion plugin' },
    ],
  },
  inkscape: {
    targetCommercialId: 'adobe-illustrator',
    targetCommercialName: 'Adobe Illustrator',
    tier: 'near-equivalent',
    illustrativePercent: 85,
    basisNoteAr: 'نسبة توافق توضيحية وليست نتيجة اختبار فعلي · ممتاز للمخططات التوضيحية والشعارات',
    basisNoteEn: 'Illustrative compatibility figure, not a lab benchmark · Industry SVG vector editor',
    functionRows: [
      { fnAr: 'الرسم المتجهي SVG', fnEn: 'Vector & Bezier Tools', status: 'ممتاز', noteAr: 'تحكم دقيق بالمنحنيات والعقد والـ Trace', noteEn: 'Precision Bezier paths & bitmap tracing' },
      { fnAr: 'تحرير مخططات PDF و DXF', fnEn: 'CAD PDF & DXF Editing', status: 'ممتاز', noteAr: 'تنظيف لوحات CAD وتلوين المخططات المعمارية', noteEn: 'Edits vector lines directly from CAD PDFs & DXFs' },
      { fnAr: 'دعم النصوص العربية', fnEn: 'Arabic Typography', status: 'ممتاز', noteAr: 'متصل وسليم الاتجاه', noteEn: 'Clean connected Arabic shaping' },
      { fnAr: 'فصل الألوان للمطابع CMYK', fnEn: 'CMYK Print Prepress', status: 'محدود', noteAr: 'يعتمد صيغة RGB/SVG ويصدر للمطبعة عبر Scribus', noteEn: 'Pair with Scribus for strict CMYK prepress' },
    ],
  },
  'davinci-resolve': {
    targetCommercialId: 'adobe-premiere-pro',
    targetCommercialName: 'Adobe Premiere Pro',
    tier: 'near-equivalent',
    illustrativePercent: 92,
    basisNoteAr: 'نسبة توافق توضيحية وليست نتيجة اختبار فعلي · مستوى هوليوود مجاناً',
    basisNoteEn: 'Illustrative compatibility figure, not a lab benchmark · Studio-grade free editor',
    functionRows: [
      { fnAr: 'المونتاج متعدد المسارات', fnEn: 'Multi-Track Editing', status: 'ممتاز', noteAr: 'سريع ومستقر مع Cut و Edit Pages', noteEn: 'Fast Cut & Edit pages up to 4K 60fps' },
      { fnAr: 'تصحيح الألوان', fnEn: 'Color Grading', status: 'ممتاز', noteAr: 'المعيار الأول عالمياً في التلوين', noteEn: 'Industry-leading node color grading' },
      { fnAr: 'الكتابة العربية', fnEn: 'Arabic Captions/Titles', status: 'جيد', noteAr: 'يعمل جيداً مع Text+ ومفاتيح الخطوط العربية', noteEn: 'Works cleanly with Text+ Arabic fonts' },
      { fnAr: 'متطلبات كرت الشاشة', fnEn: 'Hardware Need', status: 'مختلف', noteAr: 'يتطلب 16GB RAM وكرت شاشة مخصص 4GB+', noteEn: 'Requires 16GB RAM & dedicated GPU' },
    ],
  },
  ollama: {
    targetCommercialId: 'chatgpt-claude',
    targetCommercialName: 'ChatGPT Plus / Claude Pro',
    tier: 'most-tasks',
    illustrativePercent: 76,
    basisNoteAr: 'نسبة توافق توضيحية وليست نتيجة اختبار فعلي · خصوصية 100% محلياً دون إنترنت',
    basisNoteEn: 'Illustrative compatibility figure, not a lab benchmark · 100% local offline privacy',
    functionRows: [
      { fnAr: 'تشغيل النماذج محلياً (Offline)', fnEn: 'Offline Local Inference', status: 'ممتاز', noteAr: 'خصوصية كاملة لملفات المكتب والمشاريع', noteEn: 'Full privacy for confidential office documents' },
      { fnAr: 'البرمجة والسكربتات', fnEn: 'Coding & Python Scripts', status: 'جيد', noteAr: 'قوي جداً مع Qwen2.5-Coder و Llama 3.3', noteEn: 'Strong with Qwen2.5-Coder & DeepSeek local weights' },
      { fnAr: 'المهام المعقدة جداً والبحث الحي', fnEn: 'Frontier Reasoning & Web', status: 'محدود', noteAr: 'يعتمد على قوة كرت الشاشة والذاكرة (VRAM)', noteEn: 'Bounded by local GPU VRAM; pair with Perplexica for search' },
      { fnAr: 'العربية والترجمة', fnEn: 'Arabic Fluency', status: 'جيد', noteAr: 'ممتاز مع نماذج Qwen و Gemma و Aya العربية', noteEn: 'Strong with Qwen, Gemma & Cohere Aya models' },
    ],
  },
  prepomax: {
    targetCommercialId: 'csi-etabs',
    targetCommercialName: 'CSI ETABS',
    tier: 'single-task',
    illustrativePercent: 55,
    basisNoteAr: 'نسبة توافق توضيحية وليست نتيجة اختبار فعلي · ممتاز في تحليل FEM للمقاطع والتفاصيل',
    basisNoteEn: 'Illustrative compatibility figure, not a lab benchmark · Strong 3D FEM solver, not building-code design',
    functionRows: [
      { fnAr: 'تحليل العناصر المحدودة 3D FEM', fnEn: '3D Solid/Shell FEM', status: 'ممتاز', noteAr: 'تحليل خطي وغير خطي وترددات عبر CalculiX', noteEn: 'Linear, nonlinear & modal analysis via CalculiX' },
      { fnAr: 'قراءة ملفات STEP من الـ CAD', fnEn: 'STEP Geometry Import', status: 'ممتاز', noteAr: 'استيراد مباشر وتوليد شبكة Meshing آلية', noteEn: 'Clean STEP import and Netgen/Gmsh meshing' },
      { fnAr: 'التصميم التلقائي بالكود الإنشائي', fnEn: 'Auto Code Design (ACI/EC)', status: 'غير متوفر', noteAr: 'يخرج الإجهادات والانفعالات ويصمم المهندس عبر Calcpad', noteEn: 'Outputs stresses/displacements; pair with Calcpad for code checks' },
    ],
  },
  'qgis-freecad-trails': {
    targetCommercialId: 'civil-3d',
    targetCommercialName: 'Autodesk Civil 3D',
    tier: 'complementary',
    illustrativePercent: 60,
    basisNoteAr: 'نسبة توافق توضيحية وليست نتيجة اختبار فعلي · قوي في GIS والأسطح الطبوغرافية ومكمل لـ Civil 3D',
    basisNoteEn: 'Illustrative compatibility figure, not a lab benchmark · Excels at GIS & terrain; complementary for heavy corridor docs',
    functionRows: [
      { fnAr: 'تحليل التضاريس والكنتور DEM', fnEn: 'Terrain & Contour DEM', status: 'ممتاز', noteAr: 'أقوى من برامج CAD في التحليل الجغرافي', noteEn: 'Superior geospatial & DEM surface modeling' },
      { fnAr: 'الخرائط والمرافق GIS', fnEn: 'GIS Networks & Shapefiles', status: 'ممتاز', noteAr: 'دعم كامل لـ SHP و GeoJSON و WMS', noteEn: 'Native SHP, GeoJSON & coordinate projections' },
      { fnAr: 'بروفايلات الطرق والكميات الآلية', fnEn: 'Automated Road Corridors', status: 'محدود', noteAr: 'بيئة Trails في FreeCAD قيد التطوير ولا تضاهي سرعة Civil 3D', noteEn: 'FreeCAD Trails is experimental compared to Civil 3D corridors' },
    ],
  },
};

export function resolveReplacementAssessment(
  alt: FreeAlternative,
  parentCommercial?: SoftwareEntry
): ReplacementAssessment {
  const explicit = REPLACEMENT_ASSESSMENTS[alt.id];
  if (explicit) return explicit;

  const parentName = parentCommercial?.name ?? 'البرنامج التجاري';
  const parentId = parentCommercial?.id ?? alt.id;
  const tier: ReplacementAssessment['tier'] = alt.isBestFree ? 'most-tasks' : 'single-task';
  const illustrativePercent = alt.isBestFree ? 75 : 58;

  return {
    targetCommercialId: parentId,
    targetCommercialName: parentName,
    tier,
    illustrativePercent,
    basisNoteAr:
      'تقدير توضيحي مبدئي لمطابقة المهام الأساسية وليس نتيجة اختبار معملي آلي — قارن جدول الوظائف قبل الاعتماد.',
    basisNoteEn:
      'Illustrative scope estimate, not an automated lab benchmark — verify critical formats before production.',
    functionRows: [
      {
        fnAr: 'تغطية الوظائف الأساسية',
        fnEn: 'Core Workflow Coverage',
        status: alt.isBestFree ? 'جيد' : 'محدود',
        noteAr: alt.tagline,
        noteEn: alt.tagline,
      },
      {
        fnAr: 'تبادل الملفات القياسية',
        fnEn: 'Standard File Exchange',
        status: alt.fileFormats.some((f) => ['IFC', 'STEP', 'DXF', 'SVG', 'PDF', 'CSV', 'JSON'].includes(f.toUpperCase()))
          ? 'جيد'
          : 'مختلف',
        noteAr: alt.fileFormats.slice(0, 4).join(', '),
        noteEn: alt.fileFormats.slice(0, 4).join(', '),
      },
      {
        fnAr: 'دعم اللغة العربية',
        fnEn: 'Arabic Language Support',
        status: alt.arabicSupport === 'ممتاز' ? 'ممتاز' : alt.arabicSupport === 'جيد' ? 'جيد' : 'محدود',
      },
      {
        fnAr: 'التكلفة والخصوصية',
        fnEn: 'Cost & License Freedom',
        status: 'ممتاز',
        noteAr: `${alt.license} (${alt.licenseCode})`,
        noteEn: `${alt.license} (${alt.licenseCode})`,
      },
    ],
  };
}

/* ============================================================================
 * 4. GRADUAL MIGRATION PATHS (من البرنامج المدفوع إلى البديل المجاني)
 * ============================================================================ */

export interface MigrationWeekStep {
  weekNumber: number;
  titleAr: string;
  titleEn: string;
  goalAr: string;
  goalEn: string;
  actionChecklistAr: string[];
  actionChecklistEn: string[];
  practiceDeliverableAr: string;
  practiceDeliverableEn: string;
}

export interface MigrationPath {
  id: string;
  commercialId: string;
  commercialName: string;
  targetProgramId: string;
  targetName: string;
  titleAr: string;
  titleEn: string;
  subtitleAr: string;
  subtitleEn: string;
  estimatedTransitionTimeAr: string;
  estimatedTransitionTimeEn: string;
  keepCommercialForAr: string;
  keepCommercialForEn: string;
  bimArabiaUrl: string;
  weeks: MigrationWeekStep[];
}

export const MIGRATION_PATHS: MigrationPath[] = [
  {
    id: 'revit-to-openbim',
    commercialId: 'autodesk-revit',
    commercialName: 'Autodesk Revit',
    targetProgramId: 'bonsai-blenderbim',
    targetName: 'Bonsai (BlenderBIM)',
    titleAr: 'خطة الانتقال من Revit إلى OpenBIM',
    titleEn: 'Migration Plan: Revit to OpenBIM (Bonsai)',
    subtitleAr:
      'مسار عملي لمدة 4 أسابيع للمهندس المحترف للانتقال التدريجي دون توقف مشاريعك الحالية.',
    subtitleEn:
      'A practical 4-week transition plan for experienced Revit engineers to adopt OpenBIM without disrupting live projects.',
    estimatedTransitionTimeAr: '4 أسابيع (ساعة يومياً)',
    estimatedTransitionTimeEn: '4 weeks (1 hr/day)',
    keepCommercialForAr: 'احتفظ بـ Revit مؤقتاً للمشاريع التي يفرض فيها المالك تسليم ملفات .RVT أصلية.',
    keepCommercialForEn: 'Keep Revit temporarily when clients contractually mandate native .RVT deliverables.',
    bimArabiaUrl: 'https://www.youtube.com/@omar_selim1/search?query=BlenderBIM',
    weeks: [
      {
        weekNumber: 1,
        titleAr: 'الأسبوع الأول',
        titleEn: 'Week 1',
        goalAr: 'تعلّم IFC وطرق تصدير واستيراد النماذج.',
        goalEn: 'Learn IFC schemas and clean export/import settings from Revit.',
        actionChecklistAr: [
          'فهم الفرق بين IFC2x3 و IFC4 Reference View و Design Transfer View',
          'ضبط إعدادات تصدير IFC من داخل Revit مع خرائط Pset القياسية',
          'التأكد من إحداثيات المشروع Survey Point و Project Base Point عند النقل',
        ],
        actionChecklistEn: [
          'Understand IFC2x3 vs IFC4 Reference View and Design Transfer View',
          'Configure Revit IFC Exporter mappings and property sets (Psets)',
          'Verify Survey Point and shared coordinates during export',
        ],
        practiceDeliverableAr: 'تصدير نموذج فيلا أو دور سكني من Revit إلى IFC دون فقدان الطوابق.',
        practiceDeliverableEn: 'Export a multi-story Revit building cleanly to IFC4 with intact storeys.',
      },
      {
        weekNumber: 2,
        titleAr: 'الأسبوع الثاني',
        titleEn: 'Week 2',
        goalAr: 'استخدام Bonsai لفتح وفحص نماذج IFC.',
        goalEn: 'Use Bonsai (BlenderBIM) to open, inspect, and audit IFC models.',
        actionChecklistAr: [
          'تثبيت Blender وإضافة Bonsai (BlenderBIM) وضبط الوحدات المترية',
          'فحص شجرة المشروع Spatial Tree ومجموعات الخصائص Psets داخل Bonsai',
          'إضافة تعليقات التنسيق وتصدير تقرير BCF وفحص IDS',
        ],
        actionChecklistEn: [
          'Install Blender + Bonsai add-on and configure metric units',
          'Inspect Spatial Structure (Site/Building/Storey) and IFC Property Sets',
          'Run basic IDS quality checks and create BCF review viewpoints',
        ],
        practiceDeliverableAr: 'تقرير فحص كامل لنموذج Revit المصدّر وتصحيح خصائص 5 عناصر مباشرة في IFC.',
        practiceDeliverableEn: 'Audit an exported Revit model and fix 5 element properties directly in IFC.',
      },
      {
        weekNumber: 3,
        titleAr: 'الأسبوع الثالث',
        titleEn: 'Week 3',
        goalAr: 'تجربة إنشاء عناصر BIM وتعديلها.',
        goalEn: 'Author and edit native BIM elements (walls, slabs, openings, types).',
        actionChecklistAr: [
          'إنشاء أنواع جدران وأعمدة وبلاطات باستخدام IfcWallType و IfcSlabType',
          'تركيب الأبواب والشبابيك وربطها بجداول الكميات Takeoffs',
          'تنظيم الطبقات وإضافة القطاعات والمناسيب Drawing Sheets',
        ],
        actionChecklistEn: [
          'Create architectural types (IfcWallType, IfcSlabType, IfcColumnType)',
          'Place doors/windows and extract quantity takeoff tables',
          'Set up camera plans, sections, and SVG/DXF drawing sheets',
        ],
        practiceDeliverableAr: 'نمذجة غرفة أو ملحق هندسي كامل من الصفر داخل Bonsai مع إخراج مسقط وقطاع PDF.',
        practiceDeliverableEn: 'Model a small annex from scratch in Bonsai and generate PDF plan & section sheets.',
      },
      {
        weekNumber: 4,
        titleAr: 'الأسبوع الرابع',
        titleEn: 'Week 4',
        goalAr: 'تنفيذ مشروع تجريبي ومقارنة النتائج مع Revit.',
        goalEn: 'Execute a pilot project and benchmark outputs directly against Revit.',
        actionChecklistAr: [
          'اختيار مشروع سكني صغير وإعادة تنفيذه بالكامل على OpenBIM (Bonsai + LibreCAD + LibreOffice)',
          'مقارنة دقة حصر الكميات ووضوح اللوحات التنفيذية أمام مخرجات Revit',
          'توثيق الفجوات المتبقية لتحديد أي مراحل ما زالت تحتاج أداة مساعدة',
        ],
        actionChecklistEn: [
          'Run a pilot residential building end-to-end using Bonsai + LibreCAD + LibreOffice',
          'Compare quantity takeoffs and sheet clarity side-by-side with Revit',
          'Document remaining gaps to decide where hybrid workflows are still needed',
        ],
        practiceDeliverableAr: 'حزمة تسليم متكاملة: ملف IFC + لوحات PDF/DXF + جدول كميات ODS ومقارنة مكتوبة.',
        practiceDeliverableEn: 'Complete pilot package: IFC model + PDF/DXF sheets + ODS BOQ + benchmark memo.',
      },
    ],
  },
  {
    id: 'autocad-to-librecad',
    commercialId: 'autocad',
    commercialName: 'AutoCAD',
    targetProgramId: 'librecad',
    targetName: 'LibreCAD / nanoCAD 5',
    titleAr: 'خطة الانتقال من AutoCAD إلى CAD مجاني',
    titleEn: 'Migration Plan: AutoCAD to Free 2D CAD',
    subtitleAr:
      'تحول سلس للوحات التنفيذية الثنائية الأبعاد باستخدام LibreCAD و QCAD و nanoCAD.',
    subtitleEn:
      'Smooth 4-week shift for 2D drafting using LibreCAD, QCAD, and nanoCAD 5 Free.',
    estimatedTransitionTimeAr: '4 أسابيع (نصف ساعة يومياً)',
    estimatedTransitionTimeEn: '4 weeks (30 min/day)',
    keepCommercialForAr: 'للملفات المعتمدة على Dynamic Blocks المعقدة أو AutoLISP المخصص للمكتب.',
    keepCommercialForEn: 'Keep AutoCAD if workflows rely heavily on proprietary Dynamic Blocks or custom AutoLISP.',
    bimArabiaUrl: 'https://www.youtube.com/@omar_selim1/search?query=AutoCAD',
    weeks: [
      {
        weekNumber: 1,
        titleAr: 'الأسبوع الأول',
        titleEn: 'Week 1',
        goalAr: 'تحويل مكتبة القوالب والبلوكات من DWG إلى DXF قياسي.',
        goalEn: 'Convert office titleblocks, layers, and DWG templates to clean DXF.',
        actionChecklistAr: [
          'تنظيف ملفات DWG باستخدام PURGE وحذف الكيانات غير القياسية',
          'حفظ قوالب المكتب (Titleblocks, Layers, Dimension Styles) بصيغة DXF 2013',
        ],
        actionChecklistEn: [
          'Clean DWG drawings with PURGE and flatten unnecessary proxy objects',
          'Save standard titleblocks and layer templates as DXF',
        ],
        practiceDeliverableAr: 'ملف قالب رسم مكتب جاهز بصيغة DXF يفتح دون تشوه في الخطوط العربية.',
        practiceDeliverableEn: 'Clean office DXF template opening cleanly with intact text styles.',
      },
      {
        weekNumber: 2,
        titleAr: 'الأسبوع الثاني',
        titleEn: 'Week 2',
        goalAr: 'إتقان اختصارات وأدوات Snapping والطبقات في LibreCAD / QCAD.',
        goalEn: 'Master snapping, layers, and keyboard commands in LibreCAD / QCAD.',
        actionChecklistAr: [
          'ضبط Snap Modes و Grid واختصارات لوحة المفاتيح القريبة من أوتوكاد',
          'تعديل لوحة تنفيذية قائمة وإضافة التهشير Hatch والأبعاد',
        ],
        actionChecklistEn: [
          'Configure Snap Modes, Grid, and familiar command aliases',
          'Edit an existing floor plan with hatches and standard dimensions',
        ],
        practiceDeliverableAr: 'تعديل مسقط معماري كامل وإضافة جدول أبواب وشبابيك.',
        practiceDeliverableEn: 'Revised 2D floor plan with dimensions and door/window schedule.',
      },
      {
        weekNumber: 3,
        titleAr: 'الأسبوع الثالث',
        titleEn: 'Week 3',
        goalAr: 'التعامل مع ملفات DWG الحديثة عبر nanoCAD 5 و ODA File Converter.',
        goalEn: 'Handle modern DWG exchange via nanoCAD 5 Free and ODA Converter.',
        actionChecklistAr: [
          'اختبار فتح ملفات الاستشاريين الخارجيين وتحويلها بسلاسة',
          'إعداد Paper Space / Print Preview للطباعة بمقياس 1:50 و 1:100',
        ],
        actionChecklistEn: [
          'Test external consultant DWG round-tripping',
          'Set up 1:50 and 1:100 scaled PDF plotting',
        ],
        practiceDeliverableAr: 'ملف PDF تنفيذي بمقياس رسم دقيق متطابق مع مخرجات AutoCAD.',
        practiceDeliverableEn: 'Scaled PDF construction sheet matching AutoCAD plot thickness.',
      },
      {
        weekNumber: 4,
        titleAr: 'الأسبوع الرابع',
        titleEn: 'Week 4',
        goalAr: 'اعتماد المنظومة في مشروع تسليم 2D كامل مع المراجعة المتبادلة.',
        goalEn: 'Deliver a real 2D drawing package and verify external DWG compatibility.',
        actionChecklistAr: [
          'تسليم حزمة لوحات كاملة وتجربة فتحها عند طرف يستخدم AutoCAD',
          'أرشفة مكتبة البلوكات الهندسية بصيغة DXF المفتوحة',
        ],
        actionChecklistEn: [
          'Deliver complete 2D package and verify opening on an AutoCAD seat',
          'Archive reusable office CAD block library in open DXF',
        ],
        practiceDeliverableAr: 'حزمة لوحات تنفيذية مكتملة 100% ببرمجيات مجانية.',
        practiceDeliverableEn: 'Complete 2D drawing package produced with zero AutoCAD licenses.',
      },
    ],
  },
  {
    id: 'navisworks-to-bimcollab',
    commercialId: 'navisworks',
    commercialName: 'Autodesk Navisworks',
    targetProgramId: 'bimcollab-zoom',
    targetName: 'BIMcollab ZOOM + Bonsai 4D',
    titleAr: 'خطة الانتقال من Navisworks إلى تنسيق OpenBIM',
    titleEn: 'Migration Plan: Navisworks to OpenBIM Coordination',
    subtitleAr:
      'الانتقال من ملفات NWD المغلقة إلى تنسيق النماذج بمعايير IFC و BCF.',
    subtitleEn:
      'Move from proprietary NWD workflows to fast IFC + BCF coordination.',
    estimatedTransitionTimeAr: '3–4 أسابيع',
    estimatedTransitionTimeEn: '3–4 weeks',
    keepCommercialForAr: 'للمشاريع التي تتطلب فتح ملفات NWC/NWD قديمة دون إعادة تصدير IFC.',
    keepCommercialForEn: 'Needed only when legacy NWC/NWD models cannot be re-exported as IFC.',
    bimArabiaUrl: 'https://www.youtube.com/@omar_selim1/search?query=Navisworks',
    weeks: [
      {
        weekNumber: 1,
        titleAr: 'الأسبوع الأول',
        titleEn: 'Week 1',
        goalAr: 'توحيد نقطة الأصل Coordinates وتصدير IFC من كل تخصص.',
        goalEn: 'Align shared coordinates and IFC export across Arch, Struct, and MEP.',
        actionChecklistAr: [
          'التحقق من تطابق الإحداثيات بين المعماري والإنشائي والـ MEP',
          'تفعيل تصدير الخصائص الهندسية والأنظمة في ملفات IFC',
        ],
        actionChecklistEn: [
          'Verify shared coordinates across all discipline models',
          'Ensure system classification and Psets export properly in IFC',
        ],
        practiceDeliverableAr: '3 ملفات IFC متطابقة الإحداثيات تماماً عند فتحها معاً.',
        practiceDeliverableEn: '3 aligned discipline IFC files federated in the same origin.',
      },
      {
        weekNumber: 2,
        titleAr: 'الأسبوع الثاني',
        titleEn: 'Week 2',
        goalAr: 'إعداد Smart Views وتلوين الأنظمة في BIMcollab ZOOM.',
        goalEn: 'Create Smart Views and system color-coding in BIMcollab ZOOM.',
        actionChecklistAr: [
          'تجميع النماذج وفحص التقاطعات بالقطاعات الحية Section Planes',
          'إنشاء Smart Views لعزل أنظمة التكييف والحريق والكمرات',
        ],
        actionChecklistEn: [
          'Federate models and inspect intersections with live section planes',
          'Create Smart Views to isolate HVAC, fire protection, and beams',
        ],
        practiceDeliverableAr: 'جلسة تنسيق أسبوعية كاملة باستخدام BIMcollab ZOOM و BIMvision.',
        practiceDeliverableEn: 'Run a full weekly coordination review using BIMcollab ZOOM.',
      },
      {
        weekNumber: 3,
        titleAr: 'الأسبوع الثالث',
        titleEn: 'Week 3',
        goalAr: 'استبدال تقارير PDF الثابتة بسير عمل BCF التفاعلي.',
        goalEn: 'Replace static clash PDFs with live BCF issue workflows.',
        actionChecklistAr: [
          'تسجيل الملاحظات بصيغة BCF وفتحها مباشرة داخل Revit أو Bonsai',
          'تتبع حالة التعارضات (مفتوح / محلول / مغلق)',
        ],
        actionChecklistEn: [
          'Log clash issues in BCF and jump straight to elements in Revit/Bonsai',
          'Track issue status (Open / Resolved / Closed) across revisions',
        ],
        practiceDeliverableAr: 'ملف BCF متكامل يربط المنسق بالمصمم بضغطة زر.',
        practiceDeliverableEn: 'Round-trip BCF issue report linking coordinator to modeler.',
      },
      {
        weekNumber: 4,
        titleAr: 'الأسبوع الرابع',
        titleEn: 'Week 4',
        goalAr: 'تجربة ربط الجدول الزمني 4D عبر Bonsai 4D.',
        goalEn: 'Test 4D construction sequencing via Bonsai 4D.',
        actionChecklistAr: [
          'استيراد ملف المشروع الزمني XML وربط المهام بمجموعات العناصر',
          'تصدير فيديو تسلسل البناء 4D لاجتماع المالك',
        ],
        actionChecklistEn: [
          'Import XML schedule tasks and map them to IFC building sets',
          'Render a 4D construction sequence animation for stakeholders',
        ],
        practiceDeliverableAr: 'محاكاة 4D متكاملة بصيغة IFC مفتوحة.',
        practiceDeliverableEn: 'Complete open-standard 4D simulation inside IFC.',
      },
    ],
  },
  {
    id: 'max-lumion-to-blender-twinmotion',
    commercialId: 'lumion',
    commercialName: 'Lumion Pro / 3ds Max',
    targetProgramId: 'blender',
    targetName: 'Blender + Twinmotion',
    titleAr: 'خطة الانتقال من 3ds Max و Lumion إلى Blender و Twinmotion',
    titleEn: 'Migration Plan: 3ds Max & Lumion to Blender & Twinmotion',
    subtitleAr:
      'الجمع بين قوة النمذجة والرندر الواقعي في Blender والسرعة الفورية في Twinmotion.',
    subtitleEn:
      'Combine Blender’s Cycles realism with Twinmotion’s real-time walkthrough speed.',
    estimatedTransitionTimeAr: '4 أسابيع',
    estimatedTransitionTimeEn: '4 weeks',
    keepCommercialForAr: 'للمشاهد المؤرشفة القديمة بصيغة .max التي تحتاج تعديلاً سريعاً فقط.',
    keepCommercialForEn: 'Keep only when reopening legacy .max archives with heavy V-Ray shaders.',
    bimArabiaUrl: 'https://www.youtube.com/@omar_selim1/search?query=Twinmotion',
    weeks: [
      {
        weekNumber: 1,
        titleAr: 'الأسبوع الأول',
        titleEn: 'Week 1',
        goalAr: 'نقل النماذج من برامج الـ BIM إلى Twinmotion و Blender بفعالية.',
        goalEn: 'Master clean model transfer via Datasmith, FBX, glTF, and IFC.',
        actionChecklistAr: [
          'تثبيت إضافة Datasmith للمزامنة الحية مع Twinmotion',
          'تصدير النماذج بصيغة glTF/FBX وتنظيم الكاميرات في Blender',
        ],
        actionChecklistEn: [
          'Set up Datasmith live sync into Twinmotion',
          'Import glTF/FBX architectural scenes cleanly into Blender',
        ],
        practiceDeliverableAr: 'مشهد معماري مستورد بالكامل مع حفاظه على تقسيم المواد.',
        practiceDeliverableEn: 'Imported architectural model with clean separated material slots.',
      },
      {
        weekNumber: 2,
        titleAr: 'الأسبوع الثاني',
        titleEn: 'Week 2',
        goalAr: 'إتقان الإضاءة الفيزيائية والخامات PBR ومكتبة Fab.',
        goalEn: 'Master PBR materials, HDRI/Lumen lighting, and Fab assets.',
        actionChecklistAr: [
          'استخدام مكتبة Fab و PolyHaven للخامات والأثاث المجاني عالي الدقة',
          'ضبط إضاءة النهار واللقطات الليلية بـ Lumen و Path Tracer',
        ],
        actionChecklistEn: [
          'Use PolyHaven & Fab PBR materials and vegetation libraries',
          'Configure daylight & night interior lighting with Lumen/Cycles',
        ],
        practiceDeliverableAr: 'لقطتان (نهارية وليلية) بنفس جودة Lumion/V-Ray.',
        practiceDeliverableEn: 'Day and night architectural renders matching commercial quality.',
      },
      {
        weekNumber: 3,
        titleAr: 'الأسبوع الثالث',
        titleEn: 'Week 3',
        goalAr: 'تعلم Cycles و Asset Browser في Blender للقطات الداخلية التفصيلية.',
        goalEn: 'Use Blender Cycles and Asset Browser for high-detail interior shots.',
        actionChecklistAr: [
          'بناء مكتبة أثاث خاصة داخل Blender Asset Browser',
          'ضبط Denoising و AgX Color Management لنتائج فوتوغرافية',
        ],
        actionChecklistEn: [
          'Organize reusable furniture assets in Blender Asset Browser',
          'Enable GPU Denoising and AgX color grading',
        ],
        practiceDeliverableAr: 'مكتبة أثاث مكتب مصغرة ولقطة داخلية بدقة 4K.',
        practiceDeliverableEn: 'Reusable office asset catalog and 4K interior render.',
      },
      {
        weekNumber: 4,
        titleAr: 'الأسبوع الرابع',
        titleEn: 'Week 4',
        goalAr: 'إنتاج فيديو تجول معماري كامل ومعالجته في Photopea / DaVinci.',
        goalEn: 'Produce a complete architectural walkthrough video & post-processing.',
        actionChecklistAr: [
          'إعداد مسار كاميرا وتحريك الأشخاص والسيارات في Twinmotion',
          'تجميع اللقطات وإضافة الشعارات في DaVinci Resolve أو Kdenlive',
        ],
        actionChecklistEn: [
          'Animate cameras, sun study, and entourage in Twinmotion',
          'Assemble final client presentation in DaVinci Resolve',
        ],
        practiceDeliverableAr: 'فيديو عرض معماري مدته 45 ثانية بدقة 1080p/4K دون أي ترخيص مدفوع.',
        practiceDeliverableEn: '45-second client architectural video produced with zero paid licenses.',
      },
    ],
  },
  {
    id: 'primavera-to-projectlibre',
    commercialId: 'primavera-p6',
    commercialName: 'Oracle Primavera P6',
    targetProgramId: 'projectlibre',
    targetName: 'ProjectLibre + OpenProject',
    titleAr: 'خطة الانتقال من Primavera P6 إلى ProjectLibre',
    titleEn: 'Migration Plan: Primavera P6 to ProjectLibre',
    subtitleAr:
      'التحول من تراخيص P6 المكلفة للمشاريع المتوسطة والصغيرة وإدارة الجداول الحرجة.',
    subtitleEn:
      'Replace costly P6/MS Project licenses for mid-sized schedules and EVM tracking.',
    estimatedTransitionTimeAr: '3 أسابيع',
    estimatedTransitionTimeEn: '3 weeks',
    keepCommercialForAr: 'للمشاريع الحكومية أو الضخمة التي يشترط عقدها تسليم ملف .XER رسمياً.',
    keepCommercialForEn: 'Keep P6 when mega-project contracts mandate native .XER submissions.',
    bimArabiaUrl: 'https://www.youtube.com/@omar_selim1/search?query=Primavera',
    weeks: [
      {
        weekNumber: 1,
        titleAr: 'الأسبوع الأول',
        titleEn: 'Week 1',
        goalAr: 'تصدير الجداول من P6 / MS Project واستيرادها في ProjectLibre.',
        goalEn: 'Export schedules cleanly via XML/MPP and verify baseline dates.',
        actionChecklistAr: [
          'تصدير البرنامج الزمني بصيغة XML من Primavera أو فتح MPP مباشرة',
          'مراجعة التقويمات Calendars وأيام الإجازات الرسمية',
        ],
        actionChecklistEn: [
          'Export schedule to XML from Primavera or open .mpp directly',
          'Verify working calendars, holidays, and task durations',
        ],
        practiceDeliverableAr: 'جدول زمني مستورد ومطابق في تاريخ الانتهاء والمسار الحرج.',
        practiceDeliverableEn: 'Imported schedule matching original finish dates & critical path.',
      },
      {
        weekNumber: 2,
        titleAr: 'الأسبوع الثاني',
        titleEn: 'Week 2',
        goalAr: 'تخصيص الموارد وحسابات التكلفة والقيمة المكتسبة EVM.',
        goalEn: 'Assign resources, costs, and Earned Value Management (EVM).',
        actionChecklistAr: [
          'توزيع العمالة والمعدات على أنشطة هيكل تجزئة العمل WBS',
          'تحديث نسب الإنجاز ومراقبة منحنيات التدفق',
        ],
        actionChecklistEn: [
          'Assign labor/equipment resources across WBS packages',
          'Log progress updates and monitor cost/schedule variances',
        ],
        practiceDeliverableAr: 'تقرير متابعة أسبوعي بالرسوم البيانية ومؤشرات SPI / CPI.',
        practiceDeliverableEn: 'Weekly progress report with SPI/CPI tracking.',
      },
      {
        weekNumber: 3,
        titleAr: 'الأسبوع الثالث',
        titleEn: 'Week 3',
        goalAr: 'مشاركة الجدول مع الفريق عبر OpenProject وربطه بالـ BIM.',
        goalEn: 'Share schedules collaboratively via OpenProject & 4D IFC.',
        actionChecklistAr: [
          'رفع خطة المراحل إلى OpenProject لمتابعة مهندسي الموقع',
          'تصدير تقارير PDF و Excel للإدارة العليا',
        ],
        actionChecklistEn: [
          'Sync milestones into OpenProject for site engineers',
          'Export clean PDF Gantt charts for management reviews',
        ],
        practiceDeliverableAr: 'منظومة متابعة مشروع متكاملة دون تراخيص Primavera.',
        practiceDeliverableEn: 'Complete project schedule & field tracking workflow.',
      },
    ],
  },
  {
    id: 'solidworks-to-freecad',
    commercialId: 'solidworks',
    commercialName: 'SolidWorks',
    targetProgramId: 'freecad-partdesign',
    targetName: 'FreeCAD (v1.0+)',
    titleAr: 'خطة الانتقال من SolidWorks إلى FreeCAD',
    titleEn: 'Migration Plan: SolidWorks to FreeCAD',
    subtitleAr:
      'تعلّم فلسفة Sketcher و Part Design والتجميعات الجديدة في FreeCAD لإنتاج قطع التصنيع والـ CNC.',
    subtitleEn:
      'Adopt FreeCAD Sketcher, Part Design, and Assembly workbenches for mechanical parts & CNC.',
    estimatedTransitionTimeAr: '4 أسابيع',
    estimatedTransitionTimeEn: '4 weeks',
    keepCommercialForAr: 'للتجميعات الصناعية التي تتعدى آلاف الأجزاء أو ملفات SLDPRT المطلوبة من المصنع.',
    keepCommercialForEn: 'Keep SolidWorks for massive multi-thousand-part assemblies or native SLDPRT contracts.',
    bimArabiaUrl: 'https://www.youtube.com/@omar_selim1/search?query=FreeCAD',
    weeks: [
      {
        weekNumber: 1,
        titleAr: 'الأسبوع الأول',
        titleEn: 'Week 1',
        goalAr: 'تصدير قطع المكتب الحرجة بصيغة STEP وفحصها في FreeCAD.',
        goalEn: 'Export critical legacy parts as STEP and inspect geometry in FreeCAD.',
        actionChecklistAr: [
          'تحويل مكتبة المسامير والأجزاء القياسية إلى STEP',
          'التعرف على بيئة Sketcher والقيود الهندسية Constraints',
        ],
        actionChecklistEn: [
          'Convert standard hardware parts into STEP',
          'Practice fully constrained sketches in FreeCAD Sketcher',
        ],
        practiceDeliverableAr: 'رسم مقيد بالكامل وتحويله لمجسم Pad/Pocket.',
        practiceDeliverableEn: 'Fully constrained mechanical part modeled in Part Design.',
      },
      {
        weekNumber: 2,
        titleAr: 'الأسبوع الثاني',
        titleEn: 'Week 2',
        goalAr: 'بناء الجداول البارامترية (Spreadsheets) لتغيير الأبعاد ديناميكياً.',
        goalEn: 'Use Spreadsheet & VarSets for parametric dimension control.',
        actionChecklistAr: [
          'ربط أبعاد القطعة بجدول متغيرات داخل FreeCAD',
          'تجنب مشكلة Topological Naming باستخدام Datum Planes و v1.0',
        ],
        actionChecklistEn: [
          'Link dimensions to VarSets / Spreadsheet parameters',
          'Apply resilient modeling habits with Datum Planes in v1.0',
        ],
        practiceDeliverableAr: 'قطعة ميكانيكية تتغير مقاساتها آلياً من جدول القيم.',
        practiceDeliverableEn: 'Table-driven parametric mechanical component.',
      },
      {
        weekNumber: 3,
        titleAr: 'الأسبوع الثالث',
        titleEn: 'Week 3',
        goalAr: 'تجربة التجميعات وإخراج الرسومات التنفيذية في TechDraw.',
        goalEn: 'Build mechanical assemblies and TechDraw engineering sheets.',
        actionChecklistAr: [
          'تجميع 4 أجزاء متحركة باستخدام بيئة Assembly المدمجة',
          'إخراج لوحة أبعاد وتفاوتات GD&T بصيغة PDF/DXF',
        ],
        actionChecklistEn: [
          'Assemble 4 moving parts with joints in the Assembly workbench',
          'Generate dimensioned engineering drawings in TechDraw',
        ],
        practiceDeliverableAr: 'تجميع ميكانيكي مع لوحة مساقط تنفيذية للتصنيع.',
        practiceDeliverableEn: 'Working assembly with dimensioned manufacturing drawing.',
      },
      {
        weekNumber: 4,
        titleAr: 'الأسبوع الرابع',
        titleEn: 'Week 4',
        goalAr: 'اختبار التحليل الإنشائي FEM أو مسارات التصنيع CAM.',
        goalEn: 'Run structural FEM stress checks or CNC CAM toolpaths.',
        actionChecklistAr: [
          'تشغيل تحليل إجهاد مبدئي عبر CalculiX/PrePoMax',
          'تصدير ملفات STL/STEP الجاهزة للطباعة أو التشغيل',
        ],
        actionChecklistEn: [
          'Run stress checks via CalculiX / PrePoMax',
          'Export final manufacturing STEP/STL/G-code files',
        ],
        practiceDeliverableAr: 'ملف تصنيع كامل منتج بأدوات حرة 100%.',
        practiceDeliverableEn: 'Production-ready mechanical package built 100% open source.',
      },
    ],
  },
  {
    id: 'adobe-to-foss-creative',
    commercialId: 'adobe-photoshop',
    commercialName: 'Adobe Creative Cloud (Ps/Ai/Pr)',
    targetProgramId: 'gimp',
    targetName: 'GIMP + Inkscape + DaVinci Resolve',
    titleAr: 'خطة الانتقال من حزمة Adobe إلى البدائل الحرة',
    titleEn: 'Migration Plan: Adobe Creative Cloud to Free Suite',
    subtitleAr:
      'الاستغناء عن الاشتراك الشهري المتكرر لـ Photoshop و Illustrator و Premiere.',
    subtitleEn:
      'Eliminate recurring Adobe subscriptions across photo, vector, and video workflows.',
    estimatedTransitionTimeAr: '4 أسابيع',
    estimatedTransitionTimeEn: '4 weeks',
    keepCommercialForAr: 'فقط عند فرض المطبعة أو العميل ملفات .INDD / .PSD مع Smart Objects معقدة.',
    keepCommercialForEn: 'Only when print houses or agencies strictly require native .INDD / Smart Object .PSD files.',
    bimArabiaUrl: 'https://www.youtube.com/@omar_selim1/search?query=Blender',
    weeks: [
      {
        weekNumber: 1,
        titleAr: 'الأسبوع الأول',
        titleEn: 'Week 1',
        goalAr: 'الانتقال السريع لتحرير الصور عبر Photopea و GIMP.',
        goalEn: 'Transition PSD photo editing to Photopea and GIMP.',
        actionChecklistAr: [
          'تثبيت GIMP وتفعيل وضع النافذة الواحدة وتجربة Photopea للملفات الحالية',
          'تحويل الفرش والملفات القديمة إلى صيغ مفتوحة',
        ],
        actionChecklistEn: [
          'Configure GIMP workspace & test current PSD files in Photopea',
          'Export critical layered assets as TIFF/PNG/SVG backups',
        ],
        practiceDeliverableAr: 'تحرير لقطة إظهار معماري كاملة دون فتح Photoshop.',
        practiceDeliverableEn: 'Complete arch-viz post-production pass in GIMP/Photopea.',
      },
      {
        weekNumber: 2,
        titleAr: 'الأسبوع الثاني',
        titleEn: 'Week 2',
        goalAr: 'تحرير المخططات والفيكتور في Inkscape و Varos.',
        goalEn: 'Adopt Inkscape (and Varos for Arabic typography) for vector work.',
        actionChecklistAr: [
          'استيراد ملفات PDF الهندسية وتحريرها متجهياً في Inkscape',
          'تجربة Varos لضبط الكشيدة والخطوط العربية',
        ],
        actionChecklistEn: [
          'Import architectural PDFs and style diagrams in Inkscape',
          'Use Varos for clean Arabic typography & kashida styling',
        ],
        practiceDeliverableAr: 'بوستر معماري أو مخطط تحليلي بدقة لا نهائية بصيغة SVG/PDF.',
        practiceDeliverableEn: 'Presentation board and architectural diagram exported to SVG/PDF.',
      },
      {
        weekNumber: 3,
        titleAr: 'الأسبوع الثالث',
        titleEn: 'Week 3',
        goalAr: 'نقل مشاريع الفيديو إلى DaVinci Resolve و Kdenlive.',
        goalEn: 'Move Premiere timelines to DaVinci Resolve or Kdenlive.',
        actionChecklistAr: [
          'استيراد الفواصل عبر XML/EDL إلى DaVinci Resolve',
          'إعداد قوالب العناوين والشعارات الخاصة بالمكتب',
        ],
        actionChecklistEn: [
          'Import XML timelines and set up Arabic title templates',
          'Build reusable office intro/outro presets',
        ],
        practiceDeliverableAr: 'فيديو تعريفي للمشروع ممنتج بالكامل في Resolve.',
        practiceDeliverableEn: 'Full project showcase edited and graded in DaVinci Resolve.',
      },
      {
        weekNumber: 4,
        titleAr: 'الأسبوع الرابع',
        titleEn: 'Week 4',
        goalAr: 'توحيد التسليمات وحفظ الأرشيف بعيداً عن التراخيص المغلقة.',
        goalEn: 'Standardize deliverables around open formats (SVG, PDF, PNG, MP4).',
        actionChecklistAr: [
          'الاحتفاظ بنسخة SVG و PDF لكل تصميم مستقبلي بدلاً من .AI',
          'مراجعة استغناء الفريق عن الاشتراكات غير الضرورية',
        ],
        actionChecklistEn: [
          'Archive all master graphics as SVG/PDF alongside TIFF/MP4',
          'Decommission unused paid seats cleanly',
        ],
        practiceDeliverableAr: 'إلغاء الاشتراك الشهري وتوفير مئات الدولارات سنوياً.',
        practiceDeliverableEn: 'Zero-subscription creative workflow ready for production.',
      },
    ],
  },
  {
    id: 'chatgpt-to-ollama',
    commercialId: 'chatgpt-claude',
    commercialName: 'ChatGPT Plus / Claude Pro',
    targetProgramId: 'ollama',
    targetName: 'Ollama + Open WebUI + AnythingLLM',
    titleAr: 'خطة الانتقال من السحابة المغلقة إلى الذكاء الاصطناعي المحلي',
    titleEn: 'Migration Plan: Cloud AI to Private Local AI (Ollama)',
    subtitleAr:
      'تشغيل نماذج لغوية محلية مجانية لقراءة عقود المشاريع والمواصفات الهندسية بخصوصية كاملة.',
    subtitleEn:
      'Run private local LLMs to analyze contracts, specs, and code without sending confidential files to cloud servers.',
    estimatedTransitionTimeAr: 'أسبوعان',
    estimatedTransitionTimeEn: '2 weeks',
    keepCommercialForAr: 'للاستدلال المعقد جداً الذي يتجاوز قدرات عتاد جهازك المحلي.',
    keepCommercialForEn: 'Keep cloud frontier models only for reasoning tasks exceeding local VRAM.',
    bimArabiaUrl: 'https://www.youtube.com/@omar_selim1/search?query=AI',
    weeks: [
      {
        weekNumber: 1,
        titleAr: 'الأسبوع الأول',
        titleEn: 'Week 1',
        goalAr: 'تثبيت Ollama وتشغيل واجهة Open WebUI.',
        goalEn: 'Install Ollama and launch Open WebUI browser chat interface.',
        actionChecklistAr: [
          'تثبيت Ollama وتحميل نموذج مناسب لرام جهازك (مثل qwen2.5:7b أو llama3.1)',
          'تشغيل Open WebUI للحصول على تجربة محادثة مطابقة لـ ChatGPT محلياً',
        ],
        actionChecklistEn: [
          'Install Ollama and pull a RAM-matched model (e.g., qwen2.5:7b)',
          'Run Open WebUI for a familiar ChatGPT-like local interface',
        ],
        practiceDeliverableAr: 'محادثة ذكية تعمل بالكامل دون اتصال بالإنترنت.',
        practiceDeliverableEn: 'Offline local AI chat running on your workstation.',
      },
      {
        weekNumber: 2,
        titleAr: 'الأسبوع الثاني',
        titleEn: 'Week 2',
        goalAr: 'ربط مستندات المشروع (PDF المواصفات والـ BEP) بـ AnythingLLM.',
        goalEn: 'Index project PDFs, contracts & BEP specs locally in AnythingLLM.',
        actionChecklistAr: [
          'رفع ملفات المواصفات والعقود داخل مكتبة AnythingLLM المحلية',
          'الاستعلام واستخراج بنود العقد ومتطلبات الـ BIM بخصوصية تامة',
        ],
        actionChecklistEn: [
          'Ingest project specs and contracts into local AnythingLLM workspaces',
          'Query BIM requirements & clauses with zero data leaving your PC',
        ],
        practiceDeliverableAr: 'مساعد محلي خاص بوثائق مشاريع مكتبك الهندسي.',
        practiceDeliverableEn: 'Private local RAG assistant for your engineering project documents.',
      },
    ],
  },
];

/* ============================================================================
 * 5. INTEROPERABILITY LAB (مختبر التوافق بين البرامج وصيغ الملفات)
 * ============================================================================ */

export type TransferRating = 'ممتاز' | 'جيد' | 'محدود' | 'يفقد جزئياً' | 'غير منقول';

export interface InteroperabilityFlow {
  id: string;
  sourceId: string;
  sourceName: string;
  format: string;
  targetId: string;
  targetName: string;
  overallVerdictAr: string;
  overallVerdictEn: string;
  dimensions: {
    geometry: { level: TransferRating; noteAr: string; noteEn: string };
    classifications: { level: TransferRating; noteAr: string; noteEn: string };
    properties: { level: TransferRating; noteAr: string; noteEn: string };
    materials: { level: TransferRating; noteAr: string; noteEn: string };
    relationships: { level: TransferRating; noteAr: string; noteEn: string };
  };
  transfersCleanlyAr: string[];
  transfersCleanlyEn: string[];
  lostOrChangedAr: string[];
  lostOrChangedEn: string[];
}

export const INTEROPERABILITY_FLOWS: InteroperabilityFlow[] = [
  {
    id: 'revit-to-bonsai-ifc',
    sourceId: 'autodesk-revit',
    sourceName: 'Revit',
    format: 'IFC 4',
    targetId: 'bonsai-blenderbim',
    targetName: 'Bonsai',
    overallVerdictAr: 'توافق عالٍ للهندسة والخصائص في IFC4 مع فقدان شجرة العائلات البارامترية (.RFA)',
    overallVerdictEn: 'High fidelity for geometry and Psets in IFC4; Revit family parameters become standard IFC types.',
    dimensions: {
      geometry: { level: 'ممتاز', noteAr: 'الأبعاد والمجسمات والفتحات تنتقل بدقة مليمترية', noteEn: 'Dimensions, solids, and openings transfer cleanly' },
      classifications: { level: 'ممتاز', noteAr: 'تصنيفات IfcWall / IfcSlab / IfcPipe محفوظة', noteEn: 'IfcWall / IfcSlab / IfcPipe classes preserved' },
      properties: { level: 'جيد', noteAr: 'تنتقل Psets عند تفعيل Export User Defined Property Sets', noteEn: 'Psets transfer when Export User Property Sets is enabled' },
      materials: { level: 'محدود', noteAr: 'تنتقل أسماء المواد والطبقات دون خامات الإظهار المعقدة', noteEn: 'Material names & layers transfer; realistic shader nodes reset' },
      relationships: { level: 'جيد', noteAr: 'علاقات الطوابق والفضاءات محفوظة؛ قيود Revit الخاصة تفقد', noteEn: 'Storey containment intact; Revit parametric constraints do not' },
    },
    transfersCleanlyAr: [
      'الهندسة الثلاثية الأبعاد والأبعاد ومناسيب الطوابق',
      'تصنيفات buildingSMART (جدران، أعمدة، أبواب، أنظمة MEP)',
      'الخصائص الأساسية والكميات المصدّرة في Property Sets',
    ],
    transfersCleanlyEn: [
      '3D geometry, dimensions, and building storey levels',
      'buildingSMART classes (walls, columns, doors, MEP systems)',
      'Core parameters & quantities exported inside IFC Property Sets',
    ],
    lostOrChangedAr: [
      'بارامترات العائلات التفاعلية المعقدة (.RFA constraints) والجداول الداخلية لـ Revit',
      'تنظيم اللوحات والبلوكات ثنائية الأبعاد داخل Views في Revit',
      'العناصر المصنفة كـ Generic Model إذا لم تُربط بفئة IFC صحيحة',
    ],
    lostOrChangedEn: [
      'Proprietary .RFA parametric family constraints and Revit schedules',
      '2D annotation sheets and detail views inside Revit',
      'Unmapped Generic Models unless assigned explicit IFC Export classes',
    ],
  },
  {
    id: 'revit-to-bimcollab-ifc',
    sourceId: 'autodesk-revit',
    sourceName: 'Revit',
    format: 'IFC',
    targetId: 'bimcollab-zoom',
    targetName: 'BIMcollab ZOOM',
    overallVerdictAr: 'سير عمل قياسي للتنسيق والفحص — تنتقل جميع البيانات المطلوبة للمراجعة بوضوح',
    overallVerdictEn: 'Production-standard coordination pipeline — geometry, classes, and Psets load cleanly for inspection.',
    dimensions: {
      geometry: { level: 'ممتاز', noteAr: 'عرض فائق السرعة بدقة هندسية كاملة', noteEn: 'High-speed rendering with full dimensional fidelity' },
      classifications: { level: 'ممتاز', noteAr: 'فصل كامل لكل فئات وأنظمة المشروع', noteEn: 'Full discipline and IFC class tree preserved' },
      properties: { level: 'ممتاز', noteAr: 'قراءة شاملة لكل خصائص القيم والكميات', noteEn: 'All exported Psets & QTO readable in Smart Views' },
      materials: { level: 'جيد', noteAr: 'ألوان وتوصيف المواد مقروءة للتلوين الذكي', noteEn: 'Material tags & base colors preserved' },
      relationships: { level: 'ممتاز', noteAr: 'شجرة المبنى والفضاءات والأنظمة واضحة', noteEn: 'Spatial containment & system grouping intact' },
    },
    transfersCleanlyAr: [
      'جميع ملفات التخصصات مجتمعة في إحداثيات موحدة',
      'بيانات الأنظمة الميكانيكية والكهربائية وخصائص الغرف',
      'لقطات التعارضات بصيغة BCF للعودة المباشرة لـ Revit',
    ],
    transfersCleanlyEn: [
      'Federated multi-discipline models in shared coordinates',
      'MEP system tags and room/space metadata',
      'Round-trip BCF viewpoints directly back into Revit',
    ],
    lostOrChangedAr: [
      'إمكانية التعديل الهندسي المباشر (BIMcollab أداة مراجعة وفحص وليس تأليف)',
      'النصوص ثنائية الأبعاد واللوحات الورقية',
    ],
    lostOrChangedEn: [
      'Direct geometry editing (BIMcollab is an inspection/coordination viewer)',
      '2D drafting views and paper sheets',
    ],
  },
  {
    id: 'autocad-to-librecad-dwg',
    sourceId: 'autocad',
    sourceName: 'AutoCAD',
    format: 'DXF / DWG',
    targetId: 'librecad',
    targetName: 'LibreCAD',
    overallVerdictAr: 'ممتاز عبر DXF؛ أما DWG الحديث جداً فيتطلب التحويل المسبق إلى DXF أو DWG 2013',
    overallVerdictEn: 'Excellent via DXF; modern DWG requires converting to DXF or legacy DWG 2013.',
    dimensions: {
      geometry: { level: 'ممتاز', noteAr: 'الخطوط والأقواس والدوائر والإحداثيات بدقة كاملة', noteEn: 'Lines, arcs, polylines, and coordinates transfer accurately' },
      classifications: { level: 'جيد', noteAr: 'أسماء الطبقات Layers والألوان وسماكات الخطوط', noteEn: 'Layer names, colors, and lineweights preserved' },
      properties: { level: 'يفقد جزئياً', noteAr: 'Dynamic Blocks تتحول لبلوكات ثابتة', noteEn: 'Dynamic Blocks flatten into static blocks' },
      materials: { level: 'جيد', noteAr: 'التهشيرات القياسية Hatch (بعضها يحتاج ضبط مقياس)', noteEn: 'Standard hatches transfer (custom patterns may need scaling)' },
      relationships: { level: 'محدود', noteAr: 'التعليقات التوضيحية Annotative Scales تفقد', noteEn: 'Annotative scale rules do not transfer' },
    },
    transfersCleanlyAr: [
      'الطبقات (Layers)، الخطوط، الكتل العادية (Blocks)، والأبعاد الأساسية',
      'ملفات DXF 2007–2013 من وإلى LibreCAD',
    ],
    transfersCleanlyEn: [
      'Layers, geometric entities, standard blocks, and dimensions',
      'Round-trip DXF 2007–2013 drafting',
    ],
    lostOrChangedAr: [
      'النصوص العربية بنظام SHX القديم (استبدلها بخطوط TrueType قبل التصدير)',
      'تخطيطات Paper Space المتقدمة وعناصر AEC Proxy Objects',
    ],
    lostOrChangedEn: [
      'Legacy SHX Arabic fonts (convert to TrueType fonts before saving DXF)',
      'Complex multi-layout Paper Space setups and AEC proxy objects',
    ],
  },
  {
    id: 'solidworks-to-freecad-step',
    sourceId: 'solidworks',
    sourceName: 'SolidWorks',
    format: 'STEP (AP214)',
    targetId: 'freecad-partdesign',
    targetName: 'FreeCAD',
    overallVerdictAr: 'دقة هندسية صناعية تامة للقطع، لكن شجرة التصميم البارامترية لا تنتقل',
    overallVerdictEn: 'Industrial B-Rep geometry precision transfers cleanly; SolidWorks feature history does not.',
    dimensions: {
      geometry: { level: 'ممتاز', noteAr: 'أسطح B-Rep وحواف منحنية دقيقة للتصنيع CNC', noteEn: 'Exact B-Rep solids ready for CNC & CAM' },
      classifications: { level: 'جيد', noteAr: 'هيكل التجميعات الفرعية Sub-assemblies في STEP AP214', noteEn: 'Assembly tree hierarchy preserved in STEP AP214' },
      properties: { level: 'غير منقول', noteAr: 'معادلات SolidWorks وقيود Sketcher تفقد', noteEn: 'Feature tree, sketches, and equations are lost' },
      materials: { level: 'محدود', noteAr: 'ألوان الأوجه تنتقل في AP214 دون الخصائص الميكانيكية', noteEn: 'Face colors transfer in AP214; mechanical properties reassigned' },
      relationships: { level: 'غير منقول', noteAr: 'قيود الحركة Mates تحتاج إعادة ربط في FreeCAD', noteEn: 'Assembly mates must be redefined in FreeCAD Assembly' },
    },
    transfersCleanlyAr: [
      'المجسمات الصلبة B-Rep بدقة 100% للقياس والتصنيع وتحليل FEM',
      'أسماء الأجزاء وألوانها ضمن ملفات STEP AP214',
    ],
    transfersCleanlyEn: [
      'Exact B-Rep solid geometry for manufacturing and FEM',
      'Part names and surface colors inside STEP AP214',
    ],
    lostOrChangedAr: [
      'تاريخ خطوات البناء (Feature Tree) والرسومات الأولية Sketches',
      'قيود التجميع الحركية (Mates) والجداول المربوطة',
    ],
    lostOrChangedEn: [
      'Parametric feature history and original sketches',
      'Kinematic assembly mates and design tables',
    ],
  },
  {
    id: 'revit-to-twinmotion-fbx',
    sourceId: 'autodesk-revit',
    sourceName: 'Revit',
    format: 'Datasmith / FBX',
    targetId: 'twinmotion-community',
    targetName: 'Twinmotion / Blender',
    overallVerdictAr: 'ممتاز للإظهار البصري والمواد؛ مع عدم إمكانية إعادة التعديل إلى Revit',
    overallVerdictEn: 'Excellent visual transfer for materials & geometry; one-way visualization pipeline.',
    dimensions: {
      geometry: { level: 'ممتاز', noteAr: 'شبكات 3D مقسمة حسب المواد أو الفئات', noteEn: 'Clean 3D meshes grouped by material or category' },
      classifications: { level: 'محدود', noteAr: 'تختفي خصائص الـ BIM في FBX وتبقى جزئياً في Datasmith', noteEn: 'BIM semantics drop in FBX; partial metadata in Datasmith' },
      properties: { level: 'يفقد جزئياً', noteAr: 'مخصص للرندر وليس لحصر الكميات', noteEn: 'Targeted for visual rendering, not QTO' },
      materials: { level: 'ممتاز', noteAr: 'خريطة الخامات والألوان الأساسية تنقل مع المزامنة الحية', noteEn: 'Base textures and UV mapping sync smoothly' },
      relationships: { level: 'غير منقول', noteAr: 'يتحول لمشهد Mesh ثلاثي الأبعاد', noteEn: 'Flattened into renderable 3D scene hierarchy' },
    },
    transfersCleanlyAr: [
      'جميع الأسطح المعمارية وتقسيم المواد والزجاج والإضاءة الأساسية',
      'التحديث الفوري عبر Datasmith عند تعديل النموذج في Revit',
    ],
    transfersCleanlyEn: [
      'All architectural meshes, UVs, glass, and material assignments',
      'One-click live geometry sync via Datasmith',
    ],
    lostOrChangedAr: [
      'البيانات الهندسية للكميات وحسابات الأحمال (الطريق ذو اتجاه واحد للإظهار)',
    ],
    lostOrChangedEn: [
      'Engineering metadata and schedules (one-way rendering pipeline)',
    ],
  },
  {
    id: 'primavera-to-projectlibre-xer',
    sourceId: 'primavera-p6',
    sourceName: 'Primavera P6',
    format: 'XML / MPP',
    targetId: 'projectlibre',
    targetName: 'ProjectLibre',
    overallVerdictAr: 'توافق جيد للأنشطة والمدد والعلاقات عبر صيغة XML (مع فقدان أكواد P6 الخاصة)',
    overallVerdictEn: 'Good schedule & dependency fidelity via XML; Primavera-specific Activity Codes flatten.',
    dimensions: {
      geometry: { level: 'غير منقول', noteAr: 'بيانات زمنية وموارد فقط', noteEn: 'Schedule & resource data only' },
      classifications: { level: 'جيد', noteAr: 'هيكل WBS ومراحل المشروع تنتقل بوضوح', noteEn: 'WBS hierarchy transfers cleanly' },
      properties: { level: 'جيد', noteAr: 'المدد الزمنية وتواريخ البداية والنهاية والتكلفة', noteEn: 'Durations, start/finish dates, and baseline costs' },
      materials: { level: 'محدود', noteAr: 'الموارد (العمالة والمعدات) تحتاج مراجعة التقويم', noteEn: 'Resource calendars require verification' },
      relationships: { level: 'ممتاز', noteAr: 'علاقات FS/SS/FF/SF والتأخيرات Lag محفوظة', noteEn: 'FS/SS/FF/SF links and lags preserved' },
    },
    transfersCleanlyAr: [
      'هيكل WBS، التواريخ، المسار الحرج CPM، وعلاقات الأنشطة',
    ],
    transfersCleanlyEn: [
      'WBS tree, activity dates, CPM critical path, and dependencies',
    ],
    lostOrChangedAr: [
      'تنسيقات الألوان الخاصة بـ Primavera P6 وبعض حقول Activity Codes المخصصة',
      'لا يفتح .XER مباشرة دون تصدير مسبق كـ XML من داخل P6',
    ],
    lostOrChangedEn: [
      'Custom P6 layout bars and proprietary Activity Codes',
      'Native .XER requires XML export from Primavera first',
    ],
  },
  {
    id: 'cloudcompare-to-blender-e57',
    sourceId: 'cloudcompare',
    sourceName: 'CloudCompare',
    format: 'E57 / PLY / OBJ',
    targetId: 'blender',
    targetName: 'Blender / Bonsai',
    overallVerdictAr: 'نقل دقيق لسحب النقاط والشبكات لتنفيذ نمذجة المباني القائمة Scan-to-BIM',
    overallVerdictEn: 'Accurate point-cloud and mesh transfer for Scan-to-BIM modeling.',
    dimensions: {
      geometry: { level: 'ممتاز', noteAr: 'نقاط المسح الليزري وإحداثياتها محفوظة بدقة', noteEn: 'Laser scan coordinates and meshes remain true to scale' },
      classifications: { level: 'يفقد جزئياً', noteAr: 'تحفظ الطبقات عند التجزئة لكن التصنيف كجدران يتم يدوياً', noteEn: 'Segments preserved; BIM class assignment done in Bonsai' },
      properties: { level: 'جيد', noteAr: 'قيم الشدة Intensity وألوان النقاط RGB', noteEn: 'RGB point colors and intensity scalars preserved in PLY/E57' },
      materials: { level: 'جيد', noteAr: 'ألوان المسح Vertex Colors تظهر بوضوح في Blender', noteEn: 'Vertex colors render cleanly in Blender viewport' },
      relationships: { level: 'غير منقول', noteAr: 'يتم بناء العلاقات داخل نموذج IFC بعد التتبع', noteEn: 'Spatial relationships authored during Bonsai modeling' },
    },
    transfersCleanlyAr: [
      'إحداثيات المسح الليزري المصفّاة، وألوان النقاط، والشبكات السطحية OBJ/PLY',
    ],
    transfersCleanlyEn: [
      'Filtered laser scan coordinates, RGB colors, and OBJ/PLY surface meshes',
    ],
    lostOrChangedAr: [
      'تحويل سحابة النقاط مباشرة إلى جدران IFC ذكية يتطلب التتبع في Bonsai أو إضافات متخصصة',
    ],
    lostOrChangedEn: [
      'Automatic Scan-to-IFC classification requires manual tracing or dedicated plugins',
    ],
  },
];

export interface FileFormatMapEntry {
  format: string;
  fullNameAr: string;
  fullNameEn: string;
  isOpenStandard: boolean;
  canOpen: Array<{ id: string; name: string }>;
  canEdit: Array<{ id: string; name: string }>;
  notesAr: string;
  notesEn: string;
}

export const FILE_FORMAT_MAP: FileFormatMapEntry[] = [
  {
    format: 'IFC (IFC2x3 / IFC4)',
    fullNameAr: 'المعيار الدولي المفتوح لنمذجة معلومات المباني',
    fullNameEn: 'Industry Foundation Classes (OpenBIM)',
    isOpenStandard: true,
    canOpen: [
      { id: 'bonsai-blenderbim', name: 'Bonsai' },
      { id: 'bimcollab-zoom', name: 'BIMcollab ZOOM' },
      { id: 'bimvision', name: 'BIMvision' },
      { id: 'freecad-bim', name: 'FreeCAD' },
      { id: 'speckle-bim', name: 'Speckle' },
      { id: 'autodesk-revit', name: 'Revit' },
    ],
    canEdit: [
      { id: 'bonsai-blenderbim', name: 'Bonsai (BlenderBIM)' },
      { id: 'freecad-bim', name: 'FreeCAD BIM' },
      { id: 'ifcopenshell', name: 'IfcOpenShell' },
      { id: 'autodesk-revit', name: 'Revit (إعادة استيراد)' },
    ],
    notesAr: 'الصيغة الأساسية للاستقلال عن الشركات وحفظ بيانات الـ BIM طويلة الأمد.',
    notesEn: 'Primary open format for vendor independence and long-term BIM archiving.',
  },
  {
    format: 'DWG / DXF',
    fullNameAr: 'ملفات الرسم الهندسي ثنائي وثلاثي الأبعاد',
    fullNameEn: 'AutoCAD Drawing & Drawing Exchange Format',
    isOpenStandard: false,
    canOpen: [
      { id: 'autocad', name: 'AutoCAD' },
      { id: 'nanocad-free', name: 'nanoCAD 5 Free' },
      { id: 'librecad', name: 'LibreCAD (DXF)' },
      { id: 'qcad', name: 'QCAD (DXF)' },
      { id: 'inkscape', name: 'Inkscape (DXF)' },
    ],
    canEdit: [
      { id: 'autocad', name: 'AutoCAD' },
      { id: 'nanocad-free', name: 'nanoCAD 5 Free' },
      { id: 'librecad', name: 'LibreCAD (DXF)' },
      { id: 'qcad', name: 'QCAD (DXF)' },
    ],
    notesAr: 'DXF مفتوح ومقروء في كل برامج CAD المجانية؛ DWG مغلق ويتطلب nanoCAD أو التحويل.',
    notesEn: 'DXF is open and universal; proprietary DWG edits smoothly in nanoCAD 5 Free.',
  },
  {
    format: 'STEP (.stp / .step)',
    fullNameAr: 'معيار تبادل النماذج الهندسية والميكانيكية الدقيقة',
    fullNameEn: 'ISO 10303 CAD Exchange Standard',
    isOpenStandard: true,
    canOpen: [
      { id: 'freecad-partdesign', name: 'FreeCAD' },
      { id: 'solidworks', name: 'SolidWorks' },
      { id: 'prepomax', name: 'PrePoMax' },
      { id: 'cadquery', name: 'CadQuery' },
    ],
    canEdit: [
      { id: 'freecad-partdesign', name: 'FreeCAD' },
      { id: 'solidworks', name: 'SolidWorks' },
      { id: 'onshape-free', name: 'Onshape' },
    ],
    notesAr: 'أفضل صيغة لنقل القطع الميكانيكية بدقة B-Rep قبل التصنيع أو تحليل FEM.',
    notesEn: 'Best neutral format for exact mechanical B-Rep solids across CAD & FEA.',
  },
  {
    format: 'BCF (.bcf / .bcfzip)',
    fullNameAr: 'صيغة تبادل ملاحظات وتعارضات الـ BIM',
    fullNameEn: 'BIM Collaboration Format',
    isOpenStandard: true,
    canOpen: [
      { id: 'bimcollab-zoom', name: 'BIMcollab ZOOM' },
      { id: 'bonsai-blenderbim', name: 'Bonsai' },
      { id: 'bimvision', name: 'BIMvision' },
      { id: 'navisworks', name: 'Navisworks (Add-in)' },
    ],
    canEdit: [
      { id: 'bimcollab-zoom', name: 'BIMcollab ZOOM' },
      { id: 'bonsai-blenderbim', name: 'Bonsai' },
    ],
    notesAr: 'تنقل موقع الكاميرا والعناصر المتعارضة وتعليقات المهندسين دون إرسال النموذج كاملاً.',
    notesEn: 'Exchanges clash viewpoints, element GUIDs, and comments cleanly across BIM tools.',
  },
  {
    format: 'glTF / GLB / USD',
    fullNameAr: 'صيغ النماذج الثلاثية الأبعاد للعرض والويب والرندر',
    fullNameEn: 'Open 3D Visualization & Web Formats',
    isOpenStandard: true,
    canOpen: [
      { id: 'blender', name: 'Blender' },
      { id: 'twinmotion-community', name: 'Twinmotion' },
      { id: 'godot-engine', name: 'Godot' },
      { id: 'speckle-bim', name: 'Speckle' },
    ],
    canEdit: [
      { id: 'blender', name: 'Blender' },
      { id: 'godot-engine', name: 'Godot' },
    ],
    notesAr: 'مثالية للإظهار المعماري، الواقع الافتراضي، ونشر النماذج على الويب.',
    notesEn: 'Ideal for visualization, VR walkthroughs, and lightweight browser viewers.',
  },
  {
    format: 'E57 / LAS / LAZ',
    fullNameAr: 'صيغ سحب النقاط والمسح الليزري ثلاثي الأبعاد',
    fullNameEn: '3D Laser Scanning Point Clouds',
    isOpenStandard: true,
    canOpen: [
      { id: 'cloudcompare', name: 'CloudCompare' },
      { id: 'meshlab', name: 'MeshLab' },
      { id: 'blender', name: 'Blender (Add-on)' },
    ],
    canEdit: [
      { id: 'cloudcompare', name: 'CloudCompare' },
      { id: 'meshlab', name: 'MeshLab' },
    ],
    notesAr: 'معيار E57 مفتوح لتوثيق المباني القائمة Scan-to-BIM والآثار.',
    notesEn: 'Open ASTM standard for As-Built laser scans and heritage documentation.',
  },
];

export interface SampleTestFile {
  id: string;
  name: string;
  format: string;
  size: string;
  purposeAr: string;
  purposeEn: string;
  sourceLabel: string;
  url: string;
}

export const SAMPLE_TEST_FILES: SampleTestFile[] = [
  {
    id: 'sample-ifc-duplex',
    name: 'Duplex Apartment & Office (buildingSMART IFC Samples)',
    format: 'IFC4 / IFC2x3',
    size: '~18 MB',
    purposeAr: 'اختبار استيراد الجدران، الفضاءات، أنظمة MEP، والكميات في Bonsai و BIMcollab ZOOM.',
    purposeEn: 'Verify architectural walls, spaces, MEP networks, and quantities in Bonsai & BIMcollab ZOOM.',
    sourceLabel: 'buildingSMART Sample Test Files',
    url: 'https://github.com/buildingSMART/Sample-Test-Files',
  },
  {
    id: 'sample-ids-rules',
    name: 'buildingSMART IDS Audit Rulesets',
    format: 'IDS (XML)',
    size: '~2 MB',
    purposeAr: 'اختبار فحص جودة بيانات ملفات IFC تلقائياً عبر أداة IfcTester المجانية.',
    purposeEn: 'Test automated IFC metadata auditing using the open-source IfcTester tool.',
    sourceLabel: 'buildingSMART IDS Repository',
    url: 'https://github.com/buildingSMART/IDS',
  },
  {
    id: 'sample-librecad-dxf',
    name: 'LibreCAD Architectural & Mechanical DXF Samples',
    format: 'DXF',
    size: '~4 MB',
    purposeAr: 'اختبار فتح المخططات ثنائية الأبعاد، الطبقات، والطباعة بمقياس 1:100 في LibreCAD و QCAD.',
    purposeEn: 'Test 2D floor plans, layers, and 1:100 scaled plotting in LibreCAD and QCAD.',
    sourceLabel: 'LibreCAD Wiki Samples',
    url: 'https://github.com/LibreCAD/LibreCAD',
  },
];

/* ============================================================================
 * 6. HARDWARE REQUIREMENTS DATABASE (قاعدة بيانات العتاد ومتطلبات التشغيل)
 * ============================================================================ */

const HARDWARE_OVERRIDES: Record<string, HardwareProfile> = {
  'autodesk-revit': {
    minRamGb: 16,
    recRamGb: 32,
    actualRamUsage: '4–14 GB (حجم المشروع)',
    gpuTier: 'mid',
    gpuNoteAr: 'يدعم DirectX 11 بكرت 4GB VRAM، ويحتاج معالجاً سريع النواة Single-Thread',
    gpuNoteEn: 'DirectX 11 GPU (4GB+ VRAM) + strong single-core CPU clock',
    cpuAr: 'معالج حديث بتردد أحادي النواة مرتفع',
    cpuEn: 'High single-thread clock CPU',
    lowSpecFriendly: false,
    runsInBrowser: false,
    offlineCapable: true,
    portableAvailable: false,
  },
  'bonsai-blenderbim': {
    minRamGb: 8,
    recRamGb: 16,
    actualRamUsage: '1.5–6 GB',
    gpuTier: 'mid',
    gpuNoteAr: 'يعمل بكرت مدمج للملفات الصغيرة، ويفضل 4GB VRAM للنماذج الضخمة والرندر',
    gpuNoteEn: 'Works on integrated GPU for small IFCs; 4GB+ VRAM for large federated models',
    cpuAr: 'رباعي النواة 64-bit',
    cpuEn: 'Quad-core 64-bit CPU',
    lowSpecFriendly: true,
    runsInBrowser: false,
    offlineCapable: true,
    portableAvailable: true,
  },
  'freecad-bim': {
    minRamGb: 4,
    recRamGb: 8,
    actualRamUsage: '600 MB–3 GB',
    gpuTier: 'integrated',
    gpuNoteAr: 'يعمل بكفاءة ممتازة على كرت الشاشة المدمج',
    gpuNoteEn: 'Runs smoothly on integrated OpenGL graphics',
    cpuAr: 'ثنائي إلى رباعي النواة',
    cpuEn: 'Dual/Quad-core CPU',
    lowSpecFriendly: true,
    runsInBrowser: false,
    offlineCapable: true,
    portableAvailable: true,
  },
  librecad: {
    minRamGb: 2,
    recRamGb: 4,
    actualRamUsage: '120–350 MB',
    gpuTier: 'integrated',
    gpuNoteAr: 'لا يتطلب كرت شاشة مخصص — يعمل على أقدم الأجهزة',
    gpuNoteEn: 'No dedicated GPU required — runs on legacy hardware',
    cpuAr: 'أي معالج حديث أو قديم',
    cpuEn: 'Any x64/ARM CPU',
    lowSpecFriendly: true,
    runsInBrowser: false,
    offlineCapable: true,
    portableAvailable: true,
  },
  qcad: {
    minRamGb: 2,
    recRamGb: 4,
    actualRamUsage: '150–400 MB',
    gpuTier: 'integrated',
    gpuNoteAr: 'يعمل بسلاسة تامة على الكرت المدمج',
    gpuNoteEn: 'Runs smoothly on integrated graphics',
    cpuAr: 'ثنائي النواة',
    cpuEn: 'Dual-core CPU',
    lowSpecFriendly: true,
    runsInBrowser: false,
    offlineCapable: true,
    portableAvailable: true,
  },
  'nanocad-free': {
    minRamGb: 4,
    recRamGb: 8,
    actualRamUsage: '500 MB–1.8 GB',
    gpuTier: 'integrated',
    gpuNoteAr: 'كرت مدمج مع OpenGL/DirectX أساسي',
    gpuNoteEn: 'Integrated GPU with basic OpenGL/DirectX',
    cpuAr: 'Intel / AMD 64-bit',
    cpuEn: 'Intel / AMD 64-bit',
    lowSpecFriendly: true,
    runsInBrowser: false,
    offlineCapable: true,
    portableAvailable: false,
  },
  'bimcollab-zoom': {
    minRamGb: 8,
    recRamGb: 16,
    actualRamUsage: '1–4 GB',
    gpuTier: 'mid',
    gpuNoteAr: 'يستفيد من OpenGL 3.3+ لتنعيم استعراض النماذج الكبيرة',
    gpuNoteEn: 'Benefits from OpenGL 3.3+ GPU for large federated IFC viewing',
    cpuAr: 'رباعي النواة',
    cpuEn: 'Quad-core CPU',
    lowSpecFriendly: true,
    runsInBrowser: false,
    offlineCapable: true,
    portableAvailable: false,
  },
  bimvision: {
    minRamGb: 4,
    recRamGb: 8,
    actualRamUsage: '400 MB–2 GB',
    gpuTier: 'integrated',
    gpuNoteAr: 'خفيف جداً ويعمل على أجهزة اللابتوب العادية',
    gpuNoteEn: 'Very lightweight; runs well on standard office laptops',
    cpuAr: 'ثنائي النواة',
    cpuEn: 'Dual-core CPU',
    lowSpecFriendly: true,
    runsInBrowser: false,
    offlineCapable: true,
    portableAvailable: true,
  },
  blender: {
    minRamGb: 8,
    recRamGb: 32,
    actualRamUsage: '1.5–12 GB',
    gpuTier: 'dedicated',
    gpuNoteAr: 'للنمذجة يكفي 4GB VRAM، وللرندر السريع Cycles يوصى بـ RTX 8GB+',
    gpuNoteEn: '4GB VRAM for modeling; RTX 8GB+ recommended for Cycles GPU rendering',
    cpuAr: 'متعدد الأنوية 64-bit',
    cpuEn: 'Multi-core 64-bit CPU',
    lowSpecFriendly: false,
    runsInBrowser: false,
    offlineCapable: true,
    portableAvailable: true,
  },
  'twinmotion-community': {
    minRamGb: 16,
    recRamGb: 32,
    actualRamUsage: '6–16 GB',
    gpuTier: 'dedicated',
    gpuNoteAr: 'يتطلب كرت شاشة قوي DirectX 12 (8GB+ VRAM لتفعيل Lumen و Path Tracer)',
    gpuNoteEn: 'Requires dedicated DX12 GPU (8GB+ VRAM for Lumen & Path Tracer)',
    cpuAr: '6–8 أنوية حديثة',
    cpuEn: '6–8 core modern CPU',
    lowSpecFriendly: false,
    runsInBrowser: false,
    offlineCapable: true,
    portableAvailable: false,
  },
  photopea: {
    minRamGb: 4,
    recRamGb: 8,
    actualRamUsage: '400 MB–1.5 GB (داخل المتصفح)',
    gpuTier: 'integrated',
    gpuNoteAr: 'يعمل مباشرة داخل المتصفح محلياً باستخدام WebGL دون تثبيت',
    gpuNoteEn: 'Runs locally in-browser via WebGL without installation',
    cpuAr: 'أي معالج حديث',
    cpuEn: 'Any modern CPU',
    lowSpecFriendly: true,
    runsInBrowser: true,
    offlineCapable: true,
    portableAvailable: true,
  },
  drawio: {
    minRamGb: 2,
    recRamGb: 4,
    actualRamUsage: '150–350 MB',
    gpuTier: 'integrated',
    gpuNoteAr: 'لا يتطلب كرت شاشة — متوفر للويب وكحزمة Portable',
    gpuNoteEn: 'No GPU needed — available on Web & Portable desktop',
    cpuAr: 'أي معالج',
    cpuEn: 'Any CPU',
    lowSpecFriendly: true,
    runsInBrowser: true,
    offlineCapable: true,
    portableAvailable: true,
  },
  'davinci-resolve': {
    minRamGb: 16,
    recRamGb: 32,
    actualRamUsage: '6–16 GB',
    gpuTier: 'dedicated',
    gpuNoteAr: 'يعتمد بشدة على كرت الشاشة (4GB حد أدنى، 8GB+ لـ 4K)',
    gpuNoteEn: 'Heavily GPU accelerated (4GB min, 8GB+ VRAM for 4K)',
    cpuAr: '6+ أنوية',
    cpuEn: '6+ core CPU',
    lowSpecFriendly: false,
    runsInBrowser: false,
    offlineCapable: true,
    portableAvailable: false,
  },
  kdenlive: {
    minRamGb: 4,
    recRamGb: 16,
    actualRamUsage: '800 MB–3.5 GB',
    gpuTier: 'integrated',
    gpuNoteAr: 'يعمل على الأجهزة الضعيفة والمتوسطة عبر ميزة Proxy Clips',
    gpuNoteEn: 'Runs on modest PCs smoothly with Proxy Clips enabled',
    cpuAr: 'رباعي النواة',
    cpuEn: 'Quad-core CPU',
    lowSpecFriendly: true,
    runsInBrowser: false,
    offlineCapable: true,
    portableAvailable: true,
  },
  ollama: {
    minRamGb: 8,
    recRamGb: 32,
    actualRamUsage: '4–18 GB (حسب حجم النموذج)',
    gpuTier: 'dedicated',
    gpuNoteAr: 'يعمل على المعالج ببطء مقبول لنماذج 7B، ويفضل كرت NVIDIA 8GB+ للسرعة',
    gpuNoteEn: 'CPU works for 7B quantized models; 8GB+ VRAM NVIDIA GPU strongly speeds inference',
    cpuAr: 'معالج حديث يدعم AVX2',
    cpuEn: 'Modern CPU with AVX2',
    lowSpecFriendly: false,
    runsInBrowser: false,
    offlineCapable: true,
    portableAvailable: true,
  },
  comfyui: {
    minRamGb: 16,
    recRamGb: 32,
    actualRamUsage: '6–16 GB + VRAM',
    gpuTier: 'dedicated',
    gpuNoteAr: 'يتطلب كرت شاشة NVIDIA 8GB+ VRAM لتوليد الصور المعمارية بسلاسة',
    gpuNoteEn: 'Requires 8GB+ VRAM NVIDIA GPU for smooth Flux/SDXL generation',
    cpuAr: 'رباعي/سداسي النواة',
    cpuEn: 'Quad/Hexa-core CPU',
    lowSpecFriendly: false,
    runsInBrowser: true,
    offlineCapable: true,
    portableAvailable: true,
  },
  projectlibre: {
    minRamGb: 2,
    recRamGb: 4,
    actualRamUsage: '250–600 MB',
    gpuTier: 'integrated',
    gpuNoteAr: 'يعمل على أي حاسوب مكتبي قديم أو حديث',
    gpuNoteEn: 'Runs on virtually any office laptop',
    cpuAr: 'أي معالج + Java',
    cpuEn: 'Any CPU with JRE',
    lowSpecFriendly: true,
    runsInBrowser: false,
    offlineCapable: true,
    portableAvailable: true,
  },
  calcpad: {
    minRamGb: 2,
    recRamGb: 4,
    actualRamUsage: '120–300 MB',
    gpuTier: 'integrated',
    gpuNoteAr: 'خفيف جداً وفوري في حساب المعادلات الإنشائية',
    gpuNoteEn: 'Ultra-lightweight native calculator & HTML reporter',
    cpuAr: 'أي معالج',
    cpuEn: 'Any CPU',
    lowSpecFriendly: true,
    runsInBrowser: false,
    offlineCapable: true,
    portableAvailable: true,
  },
  'sweet-home-3d': {
    minRamGb: 4,
    recRamGb: 8,
    actualRamUsage: '350 MB–1.2 GB',
    gpuTier: 'integrated',
    gpuNoteAr: 'مصمم للأجهزة الضعيفة والمتوسطة مع معاينة 3D سريعة',
    gpuNoteEn: 'Designed for modest laptops with fast 3D preview',
    cpuAr: 'ثنائي النواة',
    cpuEn: 'Dual-core CPU',
    lowSpecFriendly: true,
    runsInBrowser: true,
    offlineCapable: true,
    portableAvailable: true,
  },
};

export function resolveHardwareProfile(item: {
  id: string;
  category: SoftwareCategory;
  platforms: string[];
  licenseCategory: string;
  features: string[];
}): HardwareProfile {
  const override = HARDWARE_OVERRIDES[item.id];
  if (override) return override;

  const isWeb = item.platforms.includes('Web') || item.features.includes('يعمل على الويب');
  const isHeavy3DOrAI =
    item.features.includes('إظهار معماري') ||
    item.features.includes('محركات ألعاب') ||
    (item.category === 'ai-tools' && !isWeb);
  const isLightweight =
    item.category === 'productivity' ||
    item.category === 'development' ||
    item.features.includes('رسم 2D / DWG') ||
    item.features.includes('تعديل PDF');

  const minRamGb = isHeavy3DOrAI ? 16 : isLightweight ? 4 : 8;
  const recRamGb = isHeavy3DOrAI ? 32 : isLightweight ? 8 : 16;
  const gpuTier = isHeavy3DOrAI ? 'dedicated' : item.features.includes('نمذجة 3D') ? 'mid' : 'integrated';
  const lowSpecFriendly = minRamGb <= 8 && gpuTier !== 'dedicated';

  // Commercial SaaS AI/cloud tools typically require internet; open-source desktop tools work offline
  const isCloudOnly =
    item.platforms.length === 1 && item.platforms[0] === 'Web' && item.licenseCategory === 'مدفوع';
  const offlineCapable = !isCloudOnly && !(item.id === 'chatgpt-claude' || item.id === 'midjourney-firefly' || item.id === 'perplexity-pro');
  const portableAvailable =
    item.licenseCategory !== 'مدفوع' && !item.platforms.every((p) => p === 'Web');

  return {
    minRamGb,
    recRamGb,
    actualRamUsage: isHeavy3DOrAI ? '4–12 GB' : isLightweight ? '200–900 MB' : '1–4 GB',
    gpuTier,
    gpuNoteAr:
      gpuTier === 'dedicated'
        ? 'يفضل كرت شاشة مخصص 6GB+ VRAM للأداء السلس'
        : gpuTier === 'mid'
        ? 'كرت شاشة متوسط أو حديث مع OpenGL/Vulkan'
        : 'يعمل بكرت الشاشة المدمج دون متطلبات خاصة',
    gpuNoteEn:
      gpuTier === 'dedicated'
        ? '6GB+ dedicated GPU recommended for smooth performance'
        : gpuTier === 'mid'
        ? 'Modern integrated or entry-level dedicated GPU'
        : 'Runs smoothly on integrated graphics',
    cpuAr: isHeavy3DOrAI ? '6 أنوية حديثة على الأقل' : 'ثنائي إلى رباعي النواة',
    cpuEn: isHeavy3DOrAI ? '6+ core modern CPU' : 'Dual to quad-core CPU',
    lowSpecFriendly,
    runsInBrowser: isWeb,
    offlineCapable,
    portableAvailable,
  };
}

/* ============================================================================
 * 7. GITHUB ENGINEERING RADAR (راصد مشاريع GitHub الهندسية)
 * ============================================================================ */

export type GithubEngineeringDomain =
  | 'BIM & OpenBIM'
  | 'CAD & CAM'
  | 'Structural Engineering'
  | 'GIS'
  | 'Computational Design'
  | 'AI for Architecture';

export interface GithubRadarProject {
  id: string;
  programId?: string;
  name: string;
  domain: GithubEngineeringDomain;
  summaryAr: string;
  summaryEn: string;
  lastUpdateCadenceAr: string;
  lastUpdateCadenceEn: string;
  contributorsRange: string;
  activityLevelAr: 'مرتفع جداً' | 'مرتفع' | 'منتظم';
  activityLevelEn: 'Very High' | 'High' | 'Steady';
  releasesInfo: string;
  license: string;
  officialUrl: string;
  repoUrl: string;
  engineeringNoteAr: string;
  engineeringNoteEn: string;
}

export const GITHUB_ENGINEERING_RADAR: GithubRadarProject[] = [
  {
    id: 'radar-ifcopenshell-bonsai',
    programId: 'bonsai-blenderbim',
    name: 'IfcOpenShell / Bonsai',
    domain: 'BIM & OpenBIM',
    summaryAr: 'النواة البرمجية الأشهر لقراءة وتأليف وفحص ملفات IFC مع واجهة Bonsai داخل Blender.',
    summaryEn: 'Foundational C++/Python OpenBIM toolkit and native IFC authoring environment in Blender.',
    lastUpdateCadenceAr: 'تحديثات يومية نشطة (2026)',
    lastUpdateCadenceEn: 'Daily active commits (2026)',
    contributorsRange: '180+ مساهم',
    activityLevelAr: 'مرتفع جداً',
    activityLevelEn: 'Very High',
    releasesInfo: 'إصدارات شهرية + Builds يومية',
    license: 'LGPL-3.0 / GPL-3.0',
    officialUrl: 'https://bonsaibim.org/',
    repoUrl: 'https://github.com/IfcOpenShell/IfcOpenShell',
    engineeringNoteAr: 'القيمة الهندسية الحقيقية في مطابقة buildingSMART لا في عدد النجوم وحده.',
    engineeringNoteEn: 'Real engineering value lies in strict buildingSMART schema fidelity, not star count alone.',
  },
  {
    id: 'radar-that-open',
    programId: 'that-open-engine',
    name: 'That Open Engine (IFC.js)',
    domain: 'BIM & OpenBIM',
    summaryAr: 'محرك WebGL مفتوح المصدر لبناء عوارض ومنصات BIM داخل المتصفح بسرعة عالية.',
    summaryEn: 'Modular TypeScript & WebGL engine for browser-based OpenBIM viewers and CDEs.',
    lastUpdateCadenceAr: 'تحديثات أسبوعية مستمرة',
    lastUpdateCadenceEn: 'Weekly active updates',
    contributorsRange: '90+ مساهم',
    activityLevelAr: 'مرتفع',
    activityLevelEn: 'High',
    releasesInfo: '60+ إصدار',
    license: 'MIT',
    officialUrl: 'https://thatopen.com/',
    repoUrl: 'https://github.com/ThatOpen/engine_components',
    engineeringNoteAr: 'ممتاز لبناء منصات تصفح النماذج العربية على الويب دون رسوم خوادم تجارية.',
    engineeringNoteEn: 'Ideal for custom web BIM portals without proprietary cloud viewer fees.',
  },
  {
    id: 'radar-speckle',
    programId: 'speckle-bim',
    name: 'Speckle Server & Connectors',
    domain: 'BIM & OpenBIM',
    summaryAr: 'منصة مفتوحة المصدر لتبادل البيانات وإصدارات النماذج بين Revit و Rhino و Blender و QGIS.',
    summaryEn: 'Open-source 3D data hub streaming versions across Revit, Rhino, Blender, and QGIS.',
    lastUpdateCadenceAr: 'تحديثات مستمرة يومياً',
    lastUpdateCadenceEn: 'Daily active development',
    contributorsRange: '110+ مساهم',
    activityLevelAr: 'مرتفع جداً',
    activityLevelEn: 'Very High',
    releasesInfo: '120+ إصدار',
    license: 'Apache-2.0',
    officialUrl: 'https://speckle.systems/',
    repoUrl: 'https://github.com/specklesystems/speckle-server',
    engineeringNoteAr: 'يوفر جسراً عملياً للمكاتب التي تعمل ببيئة هجينة بين Revit والأدوات الحرة.',
    engineeringNoteEn: 'Bridges hybrid teams working across both commercial and open-source tools.',
  },
  {
    id: 'radar-freecad',
    programId: 'freecad-partdesign',
    name: 'FreeCAD (v1.0+)',
    domain: 'CAD & CAM',
    summaryAr: 'مصمم CAD بارامتري كامل للعمارة والميكانيكا والـ CAM مع إصلاح مشكلة التسمية الطوبولوجية في v1.0.',
    summaryEn: 'Full parametric CAD/CAM/BIM workbench suite featuring v1.0 TNP mitigation.',
    lastUpdateCadenceAr: 'تحديثات يومية',
    lastUpdateCadenceEn: 'Daily commits',
    contributorsRange: '550+ مساهم',
    activityLevelAr: 'مرتفع جداً',
    activityLevelEn: 'Very High',
    releasesInfo: '35+ إصدار رئيسي',
    license: 'LGPL-2.0+',
    officialUrl: 'https://www.freecad.org/',
    repoUrl: 'https://github.com/FreeCAD/FreeCAD',
    engineeringNoteAr: 'الإصدار 1.0 نقل البرنامج لمرحلة استقرار إنتاجي حقيقية في Sketcher و Assembly.',
    engineeringNoteEn: 'The 1.0 release brought major production stability to Sketcher and Assemblies.',
  },
  {
    id: 'radar-librecad',
    programId: 'librecad',
    name: 'LibreCAD',
    domain: 'CAD & CAM',
    summaryAr: 'محرر رسومات 2D CAD خفيف ومستقر يدعم DXF ويعمل على أضعف الأجهزة.',
    summaryEn: 'Lightweight, cross-platform 2D DXF drafting app running smoothly on low-spec hardware.',
    lastUpdateCadenceAr: 'صيانة وتحديثات منتظمة',
    lastUpdateCadenceEn: 'Steady maintenance releases',
    contributorsRange: '120+ مساهم',
    activityLevelAr: 'منتظم',
    activityLevelEn: 'Steady',
    releasesInfo: '30+ إصدار',
    license: 'GPL-2.0',
    officialUrl: 'https://librecad.org/',
    repoUrl: 'https://github.com/LibreCAD/LibreCAD',
    engineeringNoteAr: 'مناسب كأداة رسم ميدانية سريعة لا تتأثر بتعقيد الإصدارات.',
    engineeringNoteEn: 'Reliable field drafting tool with predictable resource usage.',
  },
  {
    id: 'radar-opensees',
    programId: 'opensees',
    name: 'OpenSees / OpenSeesPy',
    domain: 'Structural Engineering',
    summaryAr: 'إطار عمل مفتوح المصدر لمحاكاة السلوك الزلزالي وغير الخطي للمنشآت والتربة.',
    summaryEn: 'Open System for Earthquake Engineering Simulation for structural & geotechnical research.',
    lastUpdateCadenceAr: 'تطوير نشط ومستمر',
    lastUpdateCadenceEn: 'Active academic & engineering commits',
    contributorsRange: '85+ مساهم',
    activityLevelAr: 'مرتفع',
    activityLevelEn: 'High',
    releasesInfo: '45+ إصدار',
    license: 'BSD-style / Open Source',
    officialUrl: 'https://opensees.berkeley.edu/',
    repoUrl: 'https://github.com/OpenSees/OpenSees',
    engineeringNoteAr: 'مرجع هندسي موثوق رغم قلة نجوم GitHub مقارنة بأدوات الويب — معياره البحث المحكّم.',
    engineeringNoteEn: 'Gold-standard seismic solver regardless of star count; vetted by peer-reviewed benchmarks.',
  },
  {
    id: 'radar-prepomax',
    programId: 'prepomax',
    name: 'PrePoMax + CalculiX',
    domain: 'Structural Engineering',
    summaryAr: 'أداة تحضير وما بعد المعالجة بصرية نظيفة للتحليل الإنشائي بالعناصر المحدودة FEM.',
    summaryEn: 'Clean GUI pre/post-processor for finite element stress and thermal analysis.',
    lastUpdateCadenceAr: 'إصدارات دورية نشطة',
    lastUpdateCadenceEn: 'Active periodic releases',
    contributorsRange: '20+ مساهم',
    activityLevelAr: 'مرتفع',
    activityLevelEn: 'High',
    releasesInfo: '40+ إصدار',
    license: 'GPL-3.0',
    officialUrl: 'https://prepomax.fs.um.si/',
    repoUrl: 'https://github.com/prepomax/PrePoMax',
    engineeringNoteAr: 'يغني عن الواجهات النصية المعقدة لمحرك CalculiX لمتخصصي التحليل الإنشائي والميكانيكي.',
    engineeringNoteEn: 'Makes CalculiX FEA accessible via an intuitive modern desktop GUI.',
  },
  {
    id: 'radar-qgis',
    programId: 'qgis-desktop',
    name: 'QGIS',
    domain: 'GIS',
    summaryAr: 'أقوى نظام معلومات جغرافية مفتوح المصدر لتحليل التضاريس، الشبكات، والخرائط الهندسية.',
    summaryEn: 'Premier open-source GIS suite for terrain DEMs, infrastructure mapping, and spatial analysis.',
    lastUpdateCadenceAr: 'تطوير يومي مكثف',
    lastUpdateCadenceEn: 'Intensive daily development',
    contributorsRange: '700+ مساهم',
    activityLevelAr: 'مرتفع جداً',
    activityLevelEn: 'Very High',
    releasesInfo: '150+ إصدار',
    license: 'GPL-2.0+',
    officialUrl: 'https://qgis.org/',
    repoUrl: 'https://github.com/qgis/QGIS',
    engineeringNoteAr: 'ينافس ArcGIS Pro في مشاريع التخطيط العمراني والبنية التحتية بدعم عربي ممتاز.',
    engineeringNoteEn: 'Matches ArcGIS Pro in urban/civil workflows with full Arabic localization.',
  },
  {
    id: 'radar-sverchok',
    programId: 'sverchok-geometry-nodes',
    name: 'Sverchok (Parametric Nodes)',
    domain: 'Computational Design',
    summaryAr: 'بيئة برمجة بصرية بارامترية داخل Blender مستلهمة من Grasshopper للتصميم الحسابي.',
    summaryEn: 'Parametric nodal system for Blender inspired by Grasshopper for computational architecture.',
    lastUpdateCadenceAr: 'تحديثات مستمرة',
    lastUpdateCadenceEn: 'Steady community updates',
    contributorsRange: '75+ مساهم',
    activityLevelAr: 'منتظم',
    activityLevelEn: 'Steady',
    releasesInfo: '25+ إصدار',
    license: 'GPL-3.0',
    officialUrl: 'https://nortikin.github.io/sverchok/',
    repoUrl: 'https://github.com/nortikin/sverchok',
    engineeringNoteAr: 'يعمل جنباً إلى جنب مع Geometry Nodes لتوليد الواجهات والشبكات الفراغية.',
    engineeringNoteEn: 'Pairs with Blender Geometry Nodes for facade paneling and space trusses.',
  },
  {
    id: 'radar-ladybug-tools',
    programId: 'ladybug-tools',
    name: 'Ladybug Tools',
    domain: 'Computational Design',
    summaryAr: 'مكتبة مفتوحة المصدر لتحليل الشمس، الرياح، الطاقة، والراحة الحرارية للمباني.',
    summaryEn: 'Open-source environmental building simulation plugins for solar, daylight, and energy.',
    lastUpdateCadenceAr: 'تطوير نشط ومستمر',
    lastUpdateCadenceEn: 'Active ongoing commits',
    contributorsRange: '60+ مساهم',
    activityLevelAr: 'مرتفع',
    activityLevelEn: 'High',
    releasesInfo: '50+ إصدار',
    license: 'GPL-3.0 / AGPL',
    officialUrl: 'https://www.ladybug.tools/',
    repoUrl: 'https://github.com/ladybug-tools/ladybug',
    engineeringNoteAr: 'تتكامل مع Blender و FreeCAD و Grasshopper لإدخال الاستدامة في مراحل التصميم الأولى.',
    engineeringNoteEn: 'Connects early massing models directly to validated EnergyPlus and Radiance engines.',
  },
  {
    id: 'radar-comfyui-arch',
    programId: 'comfyui',
    name: 'ComfyUI + ControlNet Workflows',
    domain: 'AI for Architecture',
    summaryAr: 'محرك عقد لتوليد المفاهيم المعمارية والواجهات بالذكاء الاصطناعي من سكتشات أو لقطات Blender.',
    summaryEn: 'Modular node engine for AI architectural concepting conditioned on depth maps & sketches.',
    lastUpdateCadenceAr: 'تحديثات يومية سريعة',
    lastUpdateCadenceEn: 'Rapid daily commits',
    contributorsRange: '400+ مساهم',
    activityLevelAr: 'مرتفع جداً',
    activityLevelEn: 'Very High',
    releasesInfo: '90+ إصدار',
    license: 'GPL-3.0',
    officialUrl: 'https://www.comfy.org/',
    repoUrl: 'https://github.com/comfyanonymous/ComfyUI',
    engineeringNoteAr: 'قوة الأداة في استخدام Depth/Canny ControlNet للحفاظ على نسب الكتلة المعمارية.',
    engineeringNoteEn: 'True architectural value comes from Depth/Canny ControlNet preserving building proportions.',
  },
  {
    id: 'radar-ollama',
    programId: 'ollama',
    name: 'Ollama',
    domain: 'AI for Architecture',
    summaryAr: 'تشغيل النماذج اللغوية محلياً لقراءة عقود البناء وملفات المواصفات وأكواد Python/IfcOpenShell.',
    summaryEn: 'Local LLM runtime for querying construction specs, BEPs, and generating Python BIM scripts offline.',
    lastUpdateCadenceAr: 'تحديثات أسبوعية متسارعة',
    lastUpdateCadenceEn: 'Rapid weekly updates',
    contributorsRange: '350+ مساهم',
    activityLevelAr: 'مرتفع جداً',
    activityLevelEn: 'Very High',
    releasesInfo: '110+ إصدار',
    license: 'MIT',
    officialUrl: 'https://ollama.com/',
    repoUrl: 'https://github.com/ollama/ollama',
    engineeringNoteAr: 'يسمح للمكاتب الهندسية باستخدام الذكاء الاصطناعي دون رفع ملفات المالك السرية للسحابة.',
    engineeringNoteEn: 'Enables AI assistance for confidential project specs without cloud data leakage.',
  },
];

/* ============================================================================
 * 8. LICENSE/PRICING CHANGES & ABANDONED WATCHLIST
 * ============================================================================ */

export interface LicensePricingChange {
  id: string;
  softwareName: string;
  changeYear: string;
  shiftAr: string;
  shiftEn: string;
  impactAr: string;
  impactEn: string;
  recommendedAlternativeId: string;
  recommendedAlternativeName: string;
}

export const LICENSE_PRICING_CHANGES: LicensePricingChange[] = [
  {
    id: 'change-sketchup',
    softwareName: 'SketchUp',
    changeYear: '2017 → 2020+',
    shiftAr: 'إيقاف النسخة المجانية المكتبية Make والتحول الكامل إلى اشتراك سنوي للنسخة المكتبية',
    shiftEn: 'Desktop free "SketchUp Make" discontinued; Pro moved to subscription-only',
    impactAr: 'لم يعد بالإمكان تشغيل الإضافات الهندسية أو العمل محلياً مجاناً على النسخ الجديدة.',
    impactEn: 'Local desktop plugins and offline work are locked behind annual subscriptions.',
    recommendedAlternativeId: 'blender',
    recommendedAlternativeName: 'Blender / FreeCAD',
  },
  {
    id: 'change-fusion360',
    softwareName: 'Autodesk Fusion',
    changeYear: '2020 → 2024',
    shiftAr: 'تقليص صلاحيات الخطة المجانية (حصر 10 ملفات نشطة وتعطيل التصدير لـ STEP في فترات وتقييد CAM)',
    shiftEn: 'Personal free tier restricted to 10 active editable documents and reduced CAM/export capabilities',
    impactAr: 'صعوبة الاعتماد على الخطة المجانية في مشاريع مكتب هندسي متواصلة.',
    impactEn: 'Creates workflow friction for growing hardware and CAD practices.',
    recommendedAlternativeId: 'freecad-partdesign',
    recommendedAlternativeName: 'FreeCAD',
  },
  {
    id: 'change-revit-perpetual',
    softwareName: 'Autodesk Revit / AutoCAD',
    changeYear: '2016 → 2026',
    shiftAr: 'إلغاء التراخيص الدائمة Perpetual نهائياً والاعتماد على اشتراكات سنوية متزايدة التكلفة',
    shiftEn: 'Permanent discontinuation of perpetual licenses in favor of recurring subscriptions',
    impactAr: 'إذا توقفت عن دفع الاشتراك السنوي تفقد القدرة على تعديل مشاريعك المحفوظة بصيغ .RVT المغلقة.',
    impactEn: 'Stopping subscription payments locks teams out of editing native .RVT project files.',
    recommendedAlternativeId: 'bonsai-blenderbim',
    recommendedAlternativeName: 'Bonsai (OpenBIM IFC)',
  },
  {
    id: 'change-unity',
    softwareName: 'Unity Engine',
    changeYear: '2023–2024',
    shiftAr: 'إعلان سياسة Runtime Fee ثم التراجع الجزئي مع رفع أسعار Pro للمؤسسات',
    shiftEn: 'Runtime fee controversy followed by Pro tier price hikes',
    impactAr: 'دفع كثيراً من المطورين لتجربة محركات بدون رسوم ملكية مثل Godot.',
    impactEn: 'Accelerated studio migration toward MIT-licensed engines like Godot.',
    recommendedAlternativeId: 'godot-engine',
    recommendedAlternativeName: 'Godot Engine',
  },
];

export interface AbandonedSoftwareEntry {
  id: string;
  name: string;
  categoryAr: string;
  categoryEn: string;
  statusNoteAr: string;
  statusNoteEn: string;
  replacementId: string;
  replacementName: string;
}

export const ABANDONED_SOFTWARE_WATCH: AbandonedSoftwareEntry[] = [
  {
    id: 'abandoned-bimsight',
    name: 'Tekla BIMsight',
    categoryAr: 'مراجعة نماذج IFC',
    categoryEn: 'IFC Model Viewing',
    statusNoteAr: 'تم إيقاف تطويره ودعمه رسمياً منذ نهاية 2019 (استُبدل بخدمات مدفوعة جزئياً).',
    statusNoteEn: 'Officially retired at the end of 2019 with no further security or IFC4 updates.',
    replacementId: 'bimcollab-zoom',
    replacementName: 'BIMcollab ZOOM / BIMvision',
  },
  {
    id: 'abandoned-sketchup-make',
    name: 'SketchUp Make 2017',
    categoryAr: 'نمذجة 3D معمارية',
    categoryEn: '3D Architectural Modeling',
    statusNoteAr: 'آخر نسخة مكتبية مجانية متوقفة عن التحديث ولا تدعم صيغ SketchUp الحديثة.',
    statusNoteEn: 'Last free desktop build (2017); unsupported on modern OSes and newer SKP formats.',
    replacementId: 'sweet-home-3d',
    replacementName: 'Sweet Home 3D / Blender',
  },
  {
    id: 'abandoned-flux',
    name: 'Flux.io',
    categoryAr: 'تبادل بيانات BIM السحابي',
    categoryEn: 'Cloud BIM Data Exchange',
    statusNoteAr: 'تم إغلاق الخدمة نهائياً في 2018 — تحذير مهم من الاعتماد على منصات سحابية مغلقة.',
    statusNoteEn: 'Shut down permanently in 2018 — a reminder against closed cloud lock-in.',
    replacementId: 'speckle-bim',
    replacementName: 'Speckle (Open Source)',
  },
  {
    id: 'abandoned-123d',
    name: 'Autodesk 123D Design',
    categoryAr: 'تصميم 3D مبسط',
    categoryEn: 'Lightweight 3D CAD',
    statusNoteAr: 'أوقفت Autodesk تطويره وإتاحته منذ 2017.',
    statusNoteEn: 'Discontinued and removed by Autodesk in 2017.',
    replacementId: 'freecad-partdesign',
    replacementName: 'FreeCAD / Onshape Free',
  },
];

/* ============================================================================
 * 9. ACADEMY TRACKS & HANDS-ON PRACTICE PROJECTS (أكاديمية التعلم والمشاريع)
 * ============================================================================ */

export interface PracticeProject {
  id: string;
  titleAr: string;
  titleEn: string;
  levelAr: string;
  levelEn: string;
  tools: Array<{ id: string; name: string }>;
  deliverablesAr: string;
  deliverablesEn: string;
  formats: string[];
}

export const PRACTICE_PROJECTS: PracticeProject[] = [
  {
    id: 'proj-villa-openbim',
    titleAr: 'مشروع تدريبي 1: نمذجة فيلا سكنية كاملة بمعيار OpenBIM',
    titleEn: 'Practice Project 1: Full Residential Villa in OpenBIM',
    levelAr: 'متوسط · 6 ساعات تطبيقية',
    levelEn: 'Intermediate · 6 hours',
    tools: [
      { id: 'bonsai-blenderbim', name: 'Bonsai' },
      { id: 'librecad', name: 'LibreCAD' },
      { id: 'libreoffice', name: 'LibreOffice' },
    ],
    deliverablesAr: 'بناء الدورين وإضافة الشبابيك والأبواب، استخراج مسقطين وقطاع، وحصر كميات الخرسانة والطوب في Calc.',
    deliverablesEn: 'Model 2 storeys, doors/windows, generate 2 plans + 1 section sheet, and export concrete/brick BOQ.',
    formats: ['IFC4', 'SVG', 'DXF', 'ODS'],
  },
  {
    id: 'proj-mep-clash',
    titleAr: 'مشروع تدريبي 2: كشف تعارضات التكييف والإنشائي عبر IFC + BCF',
    titleEn: 'Practice Project 2: HVAC vs Structure Coordination via IFC & BCF',
    levelAr: 'مبتدئ–متوسط · 3 ساعات',
    levelEn: 'Beginner–Intermediate · 3 hours',
    tools: [
      { id: 'bimcollab-zoom', name: 'BIMcollab ZOOM' },
      { id: 'ifctester-ids', name: 'IfcTester (IDS)' },
    ],
    deliverablesAr: 'دمج نموذجي المعماري والإنشائي من ملفات buildingSMART التجريبية، رصد 5 تعارضات، وإصدار تقرير BCF.',
    deliverablesEn: 'Federate buildingSMART sample IFCs, flag 5 clashes, and generate a structured BCF issue report.',
    formats: ['IFC', 'IDS', 'BCF'],
  },
  {
    id: 'proj-structural-beam',
    titleAr: 'مشروع تدريبي 3: تحليل كمرة ووصلة معدنية + مذكرة حسابية',
    titleEn: 'Practice Project 3: Steel Connection FEM & Calculation Note',
    levelAr: 'متقدم · 4 ساعات',
    levelEn: 'Advanced · 4 hours',
    tools: [
      { id: 'freecad-partdesign', name: 'FreeCAD' },
      { id: 'prepomax', name: 'PrePoMax' },
      { id: 'calcpad', name: 'Calcpad' },
    ],
    deliverablesAr: 'تصميم الوصلة بـ FreeCAD، تصديرها كـ STEP إلى PrePoMax لحساب الإجهادات، وتلخيص المعادلات في Calcpad.',
    deliverablesEn: 'Model bracket in FreeCAD, run CalculiX FEM stresses in PrePoMax, and publish calculation note in Calcpad.',
    formats: ['STEP', 'INP', 'HTML', 'PDF'],
  },
];

/* ============================================================================
 * 10. MAINTENANCE STATUS HELPER
 * ============================================================================ */

export function resolveMaintenanceStatus(id: string): MaintenanceStatus {
  if (id === 'nanocad-free') return 'caution';
  return 'active';
}
