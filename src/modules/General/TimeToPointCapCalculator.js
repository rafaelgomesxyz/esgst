import Module from '../../class/Module';

class GeneralTimeToPointCapCalculator extends Module {
  constructor() {
    super();
    this.info = {
      description: [
        [`ul`, [
          [`li`, `If you have less than 400P and you hover over the number of points at the header of any page, it shows how much time you have to wait until you have 400P.`]
        ]]
      ],
      features: {
        ttpcc_a: {
          name: `Show time alongside points.`,
          sg: true
        }
      },
      id: `ttpcc`,
      name: `Time To Point Cap Calculator`,
      sg: true,
      type: `general`
    };
  }
}

export default GeneralTimeToPointCapCalculator;