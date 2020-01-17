import Instrumentor from '../Instrumentor';

describe('Instrumentor', () => {
  it('Should be able complete a profiling session with at least one metric', () => {
    const instrumentor = new Instrumentor();
    instrumentor.beginSession('test');
    const basicMetric = instrumentor.metric({ scope: 'unit-tests', label: 'basic-test' });

    basicMetric.start()();
    basicMetric.start()();
    basicMetric.start()();
    basicMetric.start()();
    basicMetric.start()();
    basicMetric.start()();

    const sessionResult = instrumentor.endSession();

    expect(sessionResult).toBeTruthy();
    expect(sessionResult.sessionName).toEqual('test');
    expect(sessionResult.sessionEnd).toBeGreaterThan(sessionResult.sessionStart);

    expect(sessionResult.results).toHaveLength(6);
    for (const result of sessionResult.results) {
      expect(result.end).toBeGreaterThan(result.start);
    }

    expect(Array.isArray(sessionResult.metricLabels)).toBeTruthy();
    expect(sessionResult.metricLabels).toHaveLength(2);
    expect(sessionResult.metricLabels[0]).toEqual('default');
    expect(sessionResult.metricLabels[1]).toEqual('basic-test');

    expect(Array.isArray(sessionResult.metricScopes)).toBeTruthy();
    expect(sessionResult.metricScopes).toHaveLength(2);
    expect(sessionResult.metricScopes[0]).toEqual('default');
    expect(sessionResult.metricScopes[1]).toEqual('unit-tests');
  });
});
