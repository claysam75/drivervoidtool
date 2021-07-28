# Driver Void Tool

Full description of the maths this page uses to calculate is coming soon...

## Documentation

If you're comfortable reading JavaScript code - you can see the actual code responsible for the calculation in; /src/index.js

The function you're looking for is called handleCalculate();

Basic calculation steps are as follows;

- 1 - Calculate the hypotenuse formed by the downlight aperture width and depth.
- 2 - Calculate the angle the hypotenuse from step 1 forms with the horizontal plane.
- 3 - Calculate the maximum angle the driver can be placed at within the downlight aperture.
- 4 - With the bottom right corner of the driver pivoting on the bottom right corner of the downlight aperture, calculate how far the driver protrudes into the ceiling while at the angle calculated in step 3.
- 5 - Compare the value calculated in step 4 with the given void depth.

## To Do

- Due to driver's being (usually) rectangular) and downlight apertures being (usually) circular, the driver cannot utilise the full diameter of the aperture. The maths doesn't currently account for this so could potentially produce false positives when the driver fit is borderline.
