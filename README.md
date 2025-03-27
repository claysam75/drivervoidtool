## Driver Void Tool

---

- For the maths, look in /pages/index.js -> function handleCalculate() [line 161]

- Concepts-
  - 'End Hypotenuse' - The hypotenuse formed by the shortest and second shortest sides of the driver. Basically the limiting factor in whether the driver will fit through the cutout at all.
  - 'Aperture Hypotenuse" - The Hypotenuse formed by the width of the ceilin cutout and the depth of the ceiling build up. Determines the shallowest angle which the driver will be able to enter the cutout/ceiling.
- Brief explanation of calcultion steps
  - Check if a preset driver is in use
    - If preset used - grab pre-calculated end-hypotenuse.
    - If preset not used - calculate end hypotenuse from provided values
  - Check if endHypotenuse > or < apertureWidth.
    - Throw error if endHypotenuse < apertureWidth
  - Calculate aperture hypotenuse.
  - Calculate shallowest angle which driver can enter aperture.
  - Calculate if the full length of the driver will have cleared the cutout by the time the driver hits the upper bound of the ceiling depth.
