import { HttpRecorder } from 'nock-utils';

type TestCases = (recorder: HttpRecorder) => void;

const filePattern = /^\s+at .* \((?:.*\/)?(.+?)(?:\.test)?(?:\.(?:js|ts))?:\d+:\d+\)$/gi;

const IDX = 3;
const callerName = () =>
  (new Error().stack || '\n\n\n\n').split('\n')[IDX].replace(filePattern, '$1');

const descriptionToName = (description: string) =>
  description.toLowerCase().replace(/\s/g, '-');

export const describeRecording = (description: string, cases: TestCases = () => { }) => {
  const dir = callerName();
  const name = descriptionToName(description);
  const recorder = new HttpRecorder(`${__dirname}/cassettes/${dir}.${name}.json`);
  describe(description, () => {
    beforeEach(() => recorder.start());
    afterEach(() => recorder.stop(true));
    cases(recorder);
  });
};
