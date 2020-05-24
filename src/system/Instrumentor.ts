import { SystemLogLevel } from './Types';

export type MetricScopeMap = Map<string, number>;
export type MetricLabelMap = Map<string, number>;

export type MetricResult = {
  scope_id: number;
  label_id: number;
  start: number;
  end: number;
};

export type SessionResult = {
  metricLabels: string[];
  metricScopes: string[];
  results: MetricResult[];
  sessionName: string;
  sessionStart: number;
  sessionEnd: number;
};

export type StartSessionOptions = {
  keepLabels?: boolean;
  keepScopes?: boolean;
  keepResults?: boolean;
};

export type NewMeticOptions = {
  label?: string;
  scope?: string;
};

let getTime = () => -1;

/**
 * Used to collect metrics during runtime
 */
export interface Instrumentor {
  beginSession(name: string, options?: StartSessionOptions): void;
  endSession(): SessionResult;

  newLabel(name: string): number;
  newScope(name: string): number;

  metric(options?: NewMeticOptions): MetricCollector;
}

interface InstrumentorConstructor {
  new (): Instrumentor;
  prototype: Instrumentor;
}

interface InternalInstrumentor extends Instrumentor {
  metricLabels: MetricLabelMap;
  metricScopes: MetricScopeMap;
  results: MetricResult[];
  sessionName: string;
  sessionStart: number;
}

export interface MetricCollector {
  start(): () => void;
}

interface InternalMetricCollector extends MetricCollector {
  labelValue: number;
  scopeValue: number;
  onSubmit: (result: MetricResult) => void;
}

interface MetricCollectorConstructor {
  new (scope: number, label: number, onSubmit: (result: MetricResult) => void): MetricCollector;
  prototype: MetricCollector;
}

type Ctor = { [Symbol.hasInstance](value: any): boolean };

function load(moduleName: string) {
  // eslint-disable-next-line no-eval
  return eval('require')(moduleName);
}

let logger: (level: SystemLogLevel, message: any) => void = () => {};

const Instrumentor = (function Instrumentor(this: InternalInstrumentor): Instrumentor {
  getTime = typeof window === 'undefined' ? load('perf_hooks').performance.now : performance.now;
  this.metricScopes = new Map([['default', 0]]);
  this.metricLabels = new Map([['default', 0]]);
  this.sessionName = '';
  this.sessionStart = Date.now();
  this.sessionStart = -1;
  return this;
} as Ctor) as InstrumentorConstructor;

export default Instrumentor;

Instrumentor.prototype.beginSession = function beginSession(
  this: InternalInstrumentor,
  name: string,
  options: StartSessionOptions = {},
) {
  logger('debug', `starting a new instrumentor session named: ${name}`);
  this.sessionName = name;
  this.sessionStart = getTime();

  if (!options.keepLabels) {
    this.metricLabels = new Map([['default', 0]]);
  }

  if (!options.keepScopes) {
    this.metricScopes = new Map([['default', 0]]);
  }

  if (!options.keepResults) {
    this.results = [];
  }
};

Instrumentor.prototype.endSession = function endSession(this: InternalInstrumentor): SessionResult {
  logger('debug', `ending an active instrumentor session named: ${this.sessionName}`);

  const result: SessionResult = {
    metricLabels: strMapToStrArr(this.metricLabels),
    metricScopes: strMapToStrArr(this.metricScopes),
    sessionName: this.sessionName,
    sessionStart: this.sessionStart,
    sessionEnd: getTime(),
    results: Array.from(this.results),
  };

  return result;
};

Instrumentor.prototype.newLabel = function newLabel(this: InternalInstrumentor, name: string): number {
  logger('debug', `added a new instrumentor label named: ${name}`);
  let value = this.metricLabels.get(name);
  if (value) {
    logger('warn', `tried to add a duplicate instrumentor label named: ${name}`);
    return value;
  }

  value = this.metricLabels.size;
  this.metricLabels.set(name, value);
  return value;
};

Instrumentor.prototype.newScope = function newScope(this: InternalInstrumentor, name: string): number {
  logger('debug', `added a new instrumentor scope named: ${name}`);
  let value = this.metricScopes.get(name);
  if (value) {
    logger('warn', `tried to add a duplicate instrumentor scope named: ${name}`);
    return value;
  }

  value = this.metricScopes.size;
  this.metricScopes.set(name, value);
  return value;
};

Instrumentor.prototype.metric = function metric(
  this: InternalInstrumentor,
  options: NewMeticOptions = {},
): MetricCollector {
  const scopeName = options.scope || 'default';
  let scopeValue = this.metricScopes.get(scopeName);
  if (!scopeValue) {
    scopeValue = this.newScope(scopeName);
  }

  const labelName = options.label || 'default';
  let labelValue = this.metricLabels.get(labelName);
  if (!labelValue) {
    labelValue = this.newLabel(labelName);
  }

  const collector = new MetricCollector(scopeValue, labelValue, (result) => this.results.push(result));
  return collector;
};

/* ~~~ Metric Collector Definitions ~~~ */

const MetricCollector = (function MetricCollector(
  this: InternalMetricCollector,
  scope: number,
  label: number,
  onSubmit: (result: MetricResult) => void,
) {
  this.labelValue = label;
  this.scopeValue = scope;
  this.onSubmit = onSubmit;
  return this;
} as Ctor) as MetricCollectorConstructor;

MetricCollector.prototype.start = function start(this: InternalMetricCollector): () => void {
  const start = getTime();
  return () =>
    this.onSubmit({
      label_id: this.labelValue,
      scope_id: this.scopeValue,
      start,
      end: getTime(),
    });
};

/* ~~~ Local Utils ~~~ */

function strMapToStrArr(map: Map<string, number>): string[] {
  const strs: string[] = [];
  for (const [key, index] of map.entries()) {
    strs[index] = key;
  }
  return strs;
}

/* ~~~ System Utils ~~~ */

export function SetInstrumentorLogger(newLogger: (level: SystemLogLevel, message: any) => void): void {
  logger('debug', 'replacing the instrumentor logger with a new one');
  if (typeof newLogger === 'function') {
    logger = newLogger;
  }
}
