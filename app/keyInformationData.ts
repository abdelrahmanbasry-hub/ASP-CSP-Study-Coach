/**
 * Direct chapter-end points transcribed from the user-provided W. David Yates,
 * Safety Professional's Reference and Study Guide, 3rd ed.  A chapter is
 * marked unavailable when this supplied edition does not contain its
 * "Key Information to Remember" section; no paraphrase is substituted.
 */
export type KeyInformationChapter = {
  chapter: number;
  title: string;
  sourceStatus: "verified" | "section-not-present";
  sourcePages?: readonly number[];
  points: readonly string[];
};

const titles = [
  "The Safety Profession and Exam Preparation", "Regulations", "Math Review", "Particulates and Gases", "Toxicology", "Industrial Hygiene Air Sampling", "Ventilation", "Noise and Hearing Conservation", "Biological Hazards", "Fire Protection and Prevention", "Thermal Stressors", "Personal Protective Equipment", "Statistics for the Safety Professional", "Electrical Safety", "Mechanics", "Hydrostatics and Hydraulics", "Training", "Engineering Economics", "Management Theories", "Accident Causation and Investigation Techniques", "Workers’ Compensation", "Ergonomics", "Construction Safety", "Risk Assessment and Management", "Hazardous Materials Management", "Radiation Safety", "Walking and Working Surfaces", "Materials Handling and Storage", "Safety Management System", "Site Security", "Behavior-Based Safety", "Measuring Health and Safety Performance", "Safety Program Auditing Techniques and Checklist", "Environmental Management", "BCSP Code of Ethics",
] as const;

const verified = (chapter: number, sourcePages: readonly number[], text: string): KeyInformationChapter => ({
  chapter,
  title: titles[chapter - 1],
  sourceStatus: "verified",
  sourcePages,
  points: text.trim().split("\n"),
});

const unavailable = (chapter: number): KeyInformationChapter => ({
  chapter,
  title: titles[chapter - 1],
  sourceStatus: "section-not-present",
  points: [],
});

export const KEY_INFORMATION: readonly KeyInformationChapter[] = [
  unavailable(1),
  verified(2, [46], `
The Occupational Safety and Health Act (Public Law 91-596) was passed into law on December 29, 1970.
OSHA regulations do not apply to all employers in the public sector (municipal, county, state, or federal), self-employed individuals, family members operating a farm, or domestic household workers.
Horizontal standards are those standards that apply to all industries and employers.
Vertical standards are those standards that apply only to particular industries and employers.
Section 5(a)(1) of the OSH Act of 1970 is the General Duty Clause.
Once an employer receives a citation, he or she must post the citation in a conspicuous location for a period of 3 days or until the violation has been abated, whichever is longer.
If an employer decides to contest a citation or abatement period, or the proposed penalty, he or she has 15 working days from the time the citation or proposed penalty is received to notify the OSHA Area Director in writing.
If an employee who has received an exposure to blood-borne pathogens refuses to take the hepatitis B vaccination, he or she must sign a refusal statement, which is maintained on file with the employer.
Employee medical records, under the Blood-borne Pathogen Standard, must be maintained on file for the duration of employment plus 30 years.
A work-related recordable injury must be recorded on the OSHA 300 and 301 forms within 7 working days of receiving notification of the injury or illness.
When an authorized government representative asks for records required in 29 CFR 1904, an employer must provide copies within 4 h.
A work-related fatality must be reported to OSHA within 8 h.
A worked-related injury resulting in in-patient hospitalization, amputation, or loss of an eye must be reported to OSHA within 24 h.`),
  unavailable(3),
  verified(4, [214], `
The atomic number is the number of protons in a nucleus.
The atomic mass or weight of an atom includes protons, neutrons, and electrons.
Avogadro’s number is 6.02 × 10²³ atoms.
One mole is equal to 6.02 × 10²³ atoms.
Atomic weights of the common elements are as follows: sodium (Na) = 23, hydrogen (H) = 1, carbon (C) = 12, nitrogen (N) = 14, oxygen (O) = 16, and sulfur (S) = 32.
Valence electrons are those electrons in the outer shell of an atom. A complete number in a shell creates a more stabilized atom.
Ionic bonding is the transfer of an electron from one atom to another.
Covalent bonding is the sharing of electrons between two atoms.
The law of conservation should be kept in mind when writing chemical formulas. Energy or mass cannot be created or destroyed, but it can change its form.
The universal gas constant value is dependent upon the units of pressure, volume, temperature, and moles.
In industrial hygiene equations, the STP is equal to 25°C and 1 atm.
Ventilation STP is equal to 70°F and 1 atm.
Air density STP = 0.075 lb/ft³ at 70°F and 1 atm.
Physical science STP = 0°C and 1 atm.`),
  verified(5, [235, 236], `
Ames testing is a procedure to determine whether or not a chemical is a mutagen.
Aluminum used in bauxite ore can cause lung cancer, emphysema, and pneumoconiosis.
Asbestos used as insulation and numerous other products can cause asbestosis, lung cancer, and mesothelioma.
Arsenic from abrasive blasting can cause lung cancer or hemoglobinuria.
Benzene can cause granulocytic leukemia or myelogenous leukemia.
Beryllium from ore processing can cause CBD or berylliosis.
Cadmium from abrasive blasting can cause renal damage.
Creosote coal tar from wood preservatives causes lung cancer.
Chromium exposure can lead to the development of lung cancer.
Cobalt causes hard metal disease or lung cancer.
Nickel causes lung and nasopharynx cancer.`),
  verified(6, [255, 256], `
Industrial hygiene is the science and art dedicated to the anticipation, recognition, evaluation, and control of workplace hazards that may cause worker injuries and illnesses.
The reasons for conducting air sampling are to determine compliance with regulations, to assess worker exposures to determine if PPE is adequate, to monitor implemented control measures, to evaluate contaminant emissions, and to provide documentation.
Grab sampling is collecting a known volume of air in a container for laboratory analysis or by a direct-reading instrument.
Personal sampling involves an employee wearing an air sampler while he or she performs his or her normal work routine.
Area sampling uses the same type of pump and media as in personal sampling, but the sampling device is stationary throughout the sampling period.
Integrated sampling involves collecting one or more samples and then combining them to estimate the workers’ 8-h time-weighted average exposure.
When analyzing samples, it is highly recommended that you use an AIHA-accredited laboratory.
Before sampling, determine whether the contaminant is a gas, vapor, mist, fume, or particulate.
Filter media are used primarily to sample for particulates, such as total and respirable particulates, metals, lead, and zinc.
Sorbent tubes are used for sampling gases and vapors.
Air sampling pumps and direct-reading instruments must be pre- and post-sample-calibrated using a primary standard or a secondary standard traceable to a primary standard.
If the post-sampling flow rate is outside the ±5% of the pre-sampling flow rate, samples must be discarded.
Limit of detection is the lowest level that can be determined to be statistically different from a blank sample.
Limit of quantification is the concentration level above which quantitative results may be obtained with a certain degree of confidence.
Target concentration is an estimate of the airborne concentrations of the contaminant being tested.
When working in a potentially explosive environment, insure that all sampling equipment is classified by the manufacturer as “intrinsically safe” prior to using.`),
  verified(7, [277, 278], `
Pitot tubes usage is limited to velocities at or below 600–800 fpm.
Blast gates are used to balance the air flow in ducts of different sizes.
Capture velocity is defined as the minimum velocity of hood-induced air necessary to capture the contaminant.
When calculating the static pressure of the hood, remember that the SPh is always positive.
Static pressure on the downstream side of the fan is positive and negative on the upstream side.
Backward curved fan blades are the most efficient.
Centrifugal fans are the best for local exhaust ventilation systems.
The equation for calculating capture velocities of plain hood openings is only accurate for a limited distance of 1.5 times the diameter of a round duct or the side of a rectangle or square duct.`),
  verified(8, [295, 296], `
Fourteen hours away from noise environment is required prior to audiometric testing.
OSHA’s hearing conservation standard is 29 CFR 1910.95.
Any employee with an occupational noise exposure equaling or exceeding 85 dBA or a dose of 50% must be included in the hearing conservation program.
The Type 2 sound-level meter is the minimum standard for determining employee exposure and has an accuracy of ±1 dB.
Monitoring is required by 29 CFR 1910.95 every 2 years.
Octave band analyzers determine sound-level readings at various frequencies.
STS is a change in hearing relative to the baseline audiogram of an average of 10 dB or more at 2,000, 3,000, and 4,000 Hz in either ear.
The reference acoustic power for sound power levels is 10⁻¹² W.
The reference sound pressure level is 0.00002 N/m².
A sabin is equal to square footage of surface times the NRC.`),
  verified(9, [312, 313], `
OSHA’s Blood-Borne Pathogen Standard is found in 29 CFR 1910.1030.
The etiological agent for anthrax is B. anthracis.
Plague is an infectious disease of animals and humans caused by a bacterium named Y. pestis.
Tetanus, also known as “lockjaw,” is a disease of the nervous system caused by C. tetani.
The bacterium M. tuberculosis causes tuberculosis.
Person-to-person transmission through the fecal–oral route is the primary means of HAV in the United States.
Hepatitis B can be transmitted by percutaneous or mucous membrane exposure to infectious blood or body fluids that contain blood.
Aspergillus is a fungus (mold) that can cause aspergillosis in farmers and grain workers.
Three primary preventive measures in biological safety include laboratory practice and techniques, safety equipment, and facility construction and design.
There are four levels of biosafety (levels I, II, III, and IV).`),
  verified(10, [331], `
Radiation heat is the amount of thermal radiation between two or more objects (bodies).
Convection can be defined as the process whereby thermal energy is transferred by the movement of a heated fluid such as liquid or air.
Conduction is the transfer of thermal energy between two objects in contact with each other.
According to the NFPA, fires can be classified as A, B, C, D, or K.
Portable fire extinguishers shall be visually inspected monthly.
Portable fire extinguishers shall be serviced annually and hydrostatically tested at 5 or 12 years, depending on their shell.
The LFL or LEL is the leanest mixture that is still flammable or explosive.
The UFL or UEL is the richest mixture that is still flammable or combustible.`),
  verified(11, [350], `
Sources of heat include radiation, convection, conduction, and metabolic.
Radiant heat is the amount of thermal radiation between two more objects.
Convective heat is thermal energy transferred by the movement of a heated liquid or air.
Conductive heat is transferred by the contact of two objects.
Metabolic heat is generated from within the body through work.
Heat stroke is a medical emergency.
Heat-related injuries can be prevented through physical conditioning, fluid replacement, training, and adherence to a work/rest cycle.
The equation for an indoor WBGT is WBGT = 0.7 WB + 0.3 GT (no solar load).
The equation for an outdoor WBGT is WBGT = 0.7 WB + 0.2 GT + 0.1 DB (solar load).
Body heat is lost through radiation, conduction, convection, and evaporation.
Hypothermia is a reduction of the body’s core temperature below 98°F.
Frostbite occurs at temperatures below freezing.`),
  verified(12, [368, 369], `
On November 15, 2007, OSHA implemented a new rule clarifying employer responsibilities regarding payment for PPE. The final rule had a required implementation date of May 15, 2008.
The General Industry Standards for PPE are outlined in 29 CFR 1910.132-138.
A thorough job hazard assessment is required before issuing PPE.
Head Protection (29 CFR 1910.135).
There are three classifications of head protection, E (20,000 V), G (2,200 V), and C (conductive helmets not intended for protection from electrical conductors).
Eye and Face Protection (29 CFR 1910.133).
Hearing Protection (29 CFR 1910.95).
Respiratory Protection (29 CFR 1910.134).
Arm and Hand Protection (29 CFR 1910.138).
Foot and Leg Protection (29 CFR 1910.136).`),
  unavailable(13),
  verified(14, [404], `
Electrical currents move from high voltage to low voltage.
Voltage is measured in volts (V).
Current is the flow of electric charge and is measured in amperes (A).
Resistance is a measure of the opposition to the flow of steady electrical current and is measured in ohms (Ω).
Components connected in series are connected along a single path; thus, the same current flows through all of the components.
In a parallel circuit, the electrical current to each element in the circuit is separate.
Resistors are elements of electrical and electronic systems that are designed to intentionally resist the flow of electrical current through the system at a known measurement.
Capacitors or condensers are passive electronic components consisting of a pair of conductors separated by dielectric insulators, creating an electrical field that stores energy and produces a mechanical force between the conductors.
Inductors are passive electrical components that can store energy in a magnetic field created by the electric current passing through it.
The most common shock-related, nonfatal injury from electricity is burns.
Arc blasts occur when powerful, high-amperage currents arc through the air.
Electricity is one of the most common causes of fires and thermal burns in homes and workplaces.`),
  verified(15, [420, 421], `
The first law of thermodynamics states that energy under normal conditions cannot be created or destroyed (also known as the law of conservation).
The second law of thermodynamics states that any time work is done, some of the starting energy will be lost as heat.
Kinetic energy is the energy of motion.
Kinetic energy is measured in newtons.
1 N = 1 kg m/s².
Potential energy is the same as stored energy.
Force is a push or pull upon an object resulting from the object’s interaction with another object.
Mass is always constant, regardless of its location in the universe. Weight is variable depending on the gravitational force.
Earth’s gravity = 9.8 m/s².
Three key ingredients to work are force, displacement, and cause.
Newton’s first law of motion states: “A body continues to maintain its state of rest unless acted upon by an external, unbalanced force.”
Newton’s second law of motion states: “The net force on an object is equal to the mass of the object multiplied by its acceleration.”
Newton’s third law of motion states: “To every action there is an equal and opposite reaction.”
Speed is a scalar quantity that determines how fast an object is moving.
Velocity is a vector quantity that describes the rate at which an object changes its position.
Displacement has been identified as a change in position of an object.`),
  verified(16, [435], `
Hydrostatics, also known as fluid statics, is the science of fluids at rest and is a subfield within fluid mechanics.
Hydraulics is the science of fluids in motion, also called fluid dynamics.
Water weight, 8.34 lb/gal or 62.4 lb/ft³.
Pressure is defined as force per unit area.
Torricelli’s law is a theorem in fluid dynamics relating the speed of fluid flowing out of an opening to the height of fluid above the opening.
In fluid dynamics, head is a concept that relates energy in an incompressible fluid to the height of an equivalent static column of that fluid.
Velocity head can be described as the velocity of a fluid expressed in terms of the head or static pressure required to produce that velocity.
Reynolds number: <2,000 is laminar, 2,000 < Re < 4,000 is transitional, and >4,000 is turbulent.
Bernoulli’s principle states that for an inviscid flow, an increase in the speed of the fluid occurs simultaneously with a decrease in pressure or a decrease in the fluid’s potential energy.`),
  verified(17, [446, 447], `
Adult learners are autonomous and self-directed, have a foundation of life experiences and knowledge, are goal oriented, are relevancy oriented, are practical in nature, and need to be shown respect.
Training program development includes the following steps: performance analysis, instructional design, materials acquisition or development, training delivery, and course evaluation.
The three basic types of delivery methods include instructor-led training, self-paced learning, and structured on-the-job training.
A training needs analysis is the first step in developing a training program.
Training program development includes written performance objectives, preparing a course outline, selecting the training delivery method, selecting the materials to be used in the training, and testing and evaluation.
Pretests are administered prior to the presentation of course information and are designed to provide the starting point of knowledge.
Review tests are useful in longer courses.
Posttests should be designed to determine if the participant can perform the learning objectives.
Font size (height and width) varies with distances from the screen.`),
  unavailable(18),
  verified(19, [466], `
Maslow’s Hierarchy of Needs includes physiological, safety, belonging, esteem, and self-actualization.
McGregor’s Theory X states that employees do not want to work and are only motivated by money.
McGregor’s Theory Y states that employees like to work and, when their needs are met, actually seek out responsibility.
Herzberg’s Motivation Theory classifies factors into two categories: hygiene factors and motivation factors.
The Deming cycle has four steps, which are continuous, namely, plan, do, check, and act.
Autocratic leaders make decisions unilaterally.
Permissive leaders permit participation in the decision-making process.`),
  verified(20, [488, 489], `
The primary purpose of an accident investigation is to prevent the recurrence of the same event.
The Domino Theory, also known as Heinrich’s Domino Theory, is considered the first scientific approach to accident prevention.
According to Heinrich, an injury is caused by the social environment and inherited behavior, fault of the person, unsafe acts or conditions, and a resulting accident.
Injuries result from a completed series of factors, one of which is the accident itself (Heinrich’s Domino Theory).
Heinrich’s “Three E’s” are Engineering, Education, and Enforcement.
Heinrich’s conclusions are that 2% of accidents are unavoidable, 10% are attributed to unsafe conditions, and 88% are attributed to unsafe acts.
The Human Factors Theory states that all accidents are the result of human error, categorized as overload, inappropriate worker response, or inappropriate activities.
Petersen’s Accident/Incident Theory is a basic extension of the Human Factors Theory, except that he introduced ergonomic traps and that a decision to err may be based on logic.
The Epidemiological Theory focuses primarily on industrial hygiene aspects.
The Systems Theory states that there is a relationship between man, machine systems, and the surroundings that make up a whole system.
The Energy Release Theory, developed by William Haddon, portrays accidents in terms of energy and transference.
Behavior Theory is also known as behavior-based safety.
The Combination Theory allows an investigator to use parts or all of any of the theories to solve a problem.
The modern causation model uses a series of seven avenues to demonstrate the cause of accidents: safety management error, safety program defect, command error, system defect, operating error, mishap, and results.`),
  verified(21, [499], `
Most states require employers with five or more employees to maintain workers’ compensation insurance or be self-insured.
The first state to pass a workers’ compensation law was Wisconsin, which enacted a law in 1911. Ten additional states passed laws in the same year.
By 1948, all 48 states and 2 territories (Alaska and Hawaii) had enacted workers’ compensation laws.
Work-related injuries are classified into four main categories: partial, total, temporary, and permanent.
Workers’ compensation insurance premiums are based on dollars per $100 of payroll and an EMR or EMF.
A return-to-work/light duty program can be one of the most effective tools in reducing workers’ compensation premiums and EMRs.`),
  verified(22, [515, 516], `
The RWL is defined for a specific set of task conditions as the weight of the load that nearly all healthy workers could perform over a substantial period (up to 8 h) without an increased risk of developing lifting-related low back pain or injury.
The lifting index is a term that provides a relative estimate of the level of physical stress associated with a particular manual lifting task. It is a ratio between the weight of the object and the RWL.
Horizontal location is the distance of the hands away from the midpoint between the ankles (measured in inches or centimeters).
The vertical location is the distance of the hands above the floor.
The vertical travel distance is the absolute value of the difference between the vertical heights at the destination and origin of the lift.
Asymmetry angle is the angular measure of how far the object is displaced from the front (midsagittal plane) of the workers’ body at the beginning or ending of a lift (measured in degrees).
Lifting frequency is the average number of lifts in a 15-min period.
Lifting duration is classified as short, moderate, or long duration.
Coupling classifications are good, fair, or poor.
Significant control is defined as a condition requiring precision placement of the load at the destination of the lift.`),
  verified(23, [554], `
Excavations must be protected from cave-in if a trench is more than 4 ft deep.
Soil classifications are A, B, and C. Soil Type A is good cohesive soil with a high compressive strength. Soil Type B is cohesive soil with a moderate compressive strength, and Soil Type C is cohesive soil with low compressive strength.
Electrical current as low as 75 mA can cause death.
Bonding is connecting two or more conductive objects with a conductor.
Grounding is connecting one or more conductive objects directly to the earth using ground rods, cold pipes, or building steel.
Scaffolding requirements are addressed in 29 CFR 1926.450-454.
Anchor points for personal fall arrests should be capable of holding 5,000 lb per person.
Cranes and derricks must be clear of power lines by at least 10 ft for voltages up to 50 kV or 10 ft plus 0.4 in. for each kilovolt over 50 kV.
It is the employer’s responsibility to ensure that only well-maintained and operable hand and power tools are utilized on the job site.
When using abrasive grinders, either the ring test or the vibration test must be performed on the wheel prior to using.
Only compressed air less than 30 psi may be used for cleaning operations.
Good housekeeping practices outlined in 29 CFR 1926.258 should be adhered to on all projects.`),
  verified(24, [565], `
Risk is defined as the chance or probability of occurrence of an injury, loss, or a hazard or potential hazard.
Risk assessment is the process of assessing the risks associated with each identified hazard, in order to make decisions and implement appropriate control measures to prevent the hazard from occurring.
Hazard is a condition with the potential to cause injury, illness, or death of personnel; damage to or loss of equipment or property; or mission degradation.
Hazard identification is the process of examining each work area to identify the hazards associated with each job or task.
Probability is defined as the likelihood that a given event will occur.
Severity is defined as the degree of undesired consequences.
The five basic steps in the risk management process are hazard identification, hazard assessment, development of controls and decision making, implementation, and supervision and evaluation.
The types of controls can take many forms, but fall into three main categories: educational controls, physical controls, and avoidance.
A key element in developing and implementing control measures is to specify who, what, when, where, and how each control is to be used.
A key element of the risk decision is determining if the risk is justified.
The critical check for controls implementation, with oversight, is to ensure that controls are converted into clear, simple instructions understood at all levels.`),
  verified(25, [583, 584, 585], `
A hazardous material is any solid, liquid, or gas that can harm people, other living organisms, property, or the environment.
A hazardous waste is defined as a “solid waste” that, because of its quantity, concentration, or physical, chemical, or infectious characteristics, may (1) pose a substantial present or potential hazard to human health or the environment or (2) cause or contribute to an increase in mortality or an increase in irreversible or incapacitating illness.
All matter is classified according to its physical state, which is solid, liquid, or gas.
The physical hazards associated with materials include engulfment, over-pressurization, fires and explosions, corrosion, thermal decomposition, and other physical safety hazards.
Routes of entry into the body are inhalation, ingestion, absorption, and percutaneous or intravenous injections.
The Resource Conservation and Recovery Act regulates hazardous waste from cradle to grave, including generation, treatment, storage, and disposal of hazardous wastes.
Large-quantity generators (LQGs) generate > 1,000 kg of ordinary waste, or 1 kg acute hazardous waste per month, and can store it for up to 90 days. There is no limit on the storage amount.
SQGs generate >100 kg of ordinary waste and ≤1 kg of acute hazardous waste and can store a maximum amount of 6,000 kg for up to 180 days or 270 days if the treatment, storage, and disposal facility is located greater than 200 mi away.
Conditionally exempt SQGs (CESQGs) generate less than or equal to 100 kg of ordinary waste and less than or equal to 1 kg of acute hazardous waste and may store less than or equal to 1,000 kg indefinitely.
CERCLA created a tax on the chemical and petroleum industries. CERCLA established prohibitions and requirements concerning closed and abandoned hazardous waste sites and provided for liability of persons responsible for releases of hazardous waste at these sites. In addition, it established a trust fund to provide for cleanup when no responsible party could be identified.
TSCA authorized EPA to secure information on all new and existing chemical substances, as well as to control any of the substances that were determined to cause unreasonable risk to public health or the environment.
The U.S. Department of Transportation classifies hazardous materials into nine different types, namely, explosives, flammable gases, flammable liquids, flammable solids, oxidizers, toxic substances, radioactive, corrosives, and miscellaneous hazardous materials.
Hazardous waste operations pose a multitude of health and safety concerns to workers and the general public.
Adequate planning is the first and most critical element of hazardous waste operations.
Employees should not enter a hazardous waste site until they have been trained to a level commensurate with their job functions and responsibilities.
A medical program should be developed for each site on the basis of the specific needs, location, and potential exposures of employees at the site.
Site characterization provides the information needed to identify site hazards and to select worker protection methods.
Identification and quantification of air contaminants are made through air monitoring, which is essential in selecting PPE, delineating areas where protection is needed, assessing the potential health effects of exposure, and determining the need for specific medical monitoring.
The purpose of site control is to minimize potential contamination of workers, protect the public from the site’s hazards, and prevent vandalism.
Decontamination protects workers from hazardous substances that may contaminate and eventually permeate the protective clothing, respiratory equipment, tools, vehicles, and other equipment used on hazardous waste sites.`),
  verified(26, [606, 607], `
Ionizing radiation occurs as the result of particles or electromagnetic waves having enough energy to detach electrons from atoms or molecules, thereby causing ionization of the atom.
The three types of particle radiation are alpha (α), beta (β), and neutron (n).
Alpha radiation is a helium nucleus that has two neutrons and two protons.
Beta particles are excess electrons. They are formed when an atom with one excess neutron transforms the neutron to a proton and ejects the extra electron.
Neutron radiation is an indirect ionizing radiation, which consists of free neutrons.
The two types of electromagnetic radiation are gamma (γ) radiation and X-rays.
Gamma rays are released when an atomic nucleus releases excess energy after a decay reaction.
X-rays are produced when an atomic nucleus stabilizes itself by taking an electron from an electron cloud.
Biological effects of ionizing radiation are attributed to the ionization process that destroys the capacity for cell reproduction or causes cell mutation.
Radioactive decay occurs as alpha decay, beta decay, or series chain.
The radiological half-life is the time that it takes for one-half of the atoms of that substance to disintegrate into another nuclear form.
The three primary controls for radiation are time, distance, and shielding.
Reducing the time means less exposure.
The dose received by employees is inversely proportional to distance; therefore, the greater the distance from the source, the less the dose.
By placing an appropriate shield between the radioactive source and the employee, radiation is attenuated, and exposure may be completely eliminated or reduced to an acceptable level.
OSHA’s ionizing radiation exposure limit is 5 rem/year, 1.25 rem/quarter.
Nonionizing radiation is described as a series of energy waves composed of oscillating electric and magnetic fields traveling at the speed of light. Nonionizing radiation includes UV, visible light, IR, MW, RF, and ELF.`),
  verified(27, [631], `
The employer must ensure that ladders are maintained in proper working conditions, inspected before each use and taken out-of-service when they do not meet the requirements of 29 CFR 1910.23.
Extension ladders should extend at least three (3) ft beyond the landing point.
Extension ladders must follow a 1:4 ratio from the base of the ladder from the distance to the base of the wall. In other words, to calculate the distance from the base of the wall to the base of the ladder, use the following equation: distance = x/4, where x is the height of the wall.
Ladder ratings are based on their maximum weight capacities.
Stair treads and risers should be uniform.
Stair treads should also be constructed of slip-resistant materials.
Scaffolding should be placed on level and solid foundations.
Fall protection is required at 4′ under the general industry standards and at 6′ under the construction industry standards.
Personal Fall Arrest Systems includes the harness, connecting devices, lanyard, and anchor points that must be rated to withstand 5,000 lb of force per person.
Employees must be trained before they are permitted to be exposed to fall hazards.`),
  verified(28, [665, 666], `
When manual lifting must be performed, key principles include reducing the weight and size of packages; getting assistance when needed; lifting should be done with the legs; keeping the back straight; avoiding twisting; and avoiding overhead lifting.
The Power Lifting Technique allows lifts to be completed without bending the knees below 120° angles, which places less stress on the lifter’s back.
When using hand tools for materials handling, it is important that the proper PPE be worn, including gloves, safety-toed shoes, safety glasses, and other PPE are required depending on the operational environment.
Shoveling rates are based on the maximum 15-min weight limit and the individual shovel/load weight.
Users of materials handling equipment should ALWAYS consult and follow the manufacturer’s recommendations.
Pinch points are very common hazards associated with dollies and hand trucks.
Initial forklift training is required BEFORE an employee is permitted to operate a forklift. During forklift training, forklift operation must be conducted under the direct supervision of a competent trainer.
Refresher training must be completed (1) when the operator has been observed to operate the vehicle in an unsafe manner; (2) when the operator has been involved in an accident or near-miss incident; (3) when the operator has received an evaluation that reveals that the operator is not operating the truck safely; (4) the operator is assigned to drive a different truck; or (5) a condition in the workplace changes in a manner that could affect safe operation of the truck.
Preoperational inspections should be conducted by each operator prior to operating the piece of equipment.
The center of gravity on a forklift will change based on the weight and height of the load on the forks.
A comprehensive inspection of the semi-trailer must be conducted before a forklift enters to either load or unload materials.`),
  unavailable(29),
  unavailable(30),
  unavailable(31),
  unavailable(32),
  unavailable(33),
  unavailable(34),
  unavailable(35),
];
