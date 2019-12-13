import {
  IMultitoolCommandFailed,
  IMultitoolCommandResult,
  IMultitoolCommandSuccess,
  MultitoolCommandAction,
  MultitoolCommandResult,
} from 'bf-types';
import { Api } from '../api/Types';
import { Nullable } from '../common';
import System, { LibModule } from '../system';
import { Multitool } from './Types';

function multitool(): Multitool {
  let api: Nullable<Api> = null;

  function getApi(): Api {
    if (!api) {
      api = System.getLibModule<Api>(LibModule.API);
    }
    return api;
  }

  async function executeCommand(command: string): Promise<IMultitoolCommandResult> {
    const results = await getApi().post<IMultitoolCommandResult[]>('core/multitoolCommand/command/execute', {
      command,
    });
    if (!Array.isArray(results) || results.length < 1) {
      const result: IMultitoolCommandFailed = {
        action: MultitoolCommandAction.CREATED,
        result: MultitoolCommandResult.FAILED,
        reason: 'no response was given',
      };
      return result;
    }

    return results[0];
  }

  async function executeCommands(commands: string[]): Promise<IMultitoolCommandResult[]> {
    const results = await getApi().post<IMultitoolCommandResult[]>('core/multitoolCommand/command/execute', {
      command: commands.join('\n'),
    });
    if (!Array.isArray(results) || results.length < 1) {
      const result: IMultitoolCommandFailed = {
        action: MultitoolCommandAction.CREATED,
        result: MultitoolCommandResult.FAILED,
        reason: 'no response was given',
      };
      return [result];
    }

    return results;
  }

  function isCommandFailedResult(result: IMultitoolCommandResult): result is IMultitoolCommandFailed {
    return result.result === MultitoolCommandResult.FAILED;
  }

  function isCommandSuccessResult(result: IMultitoolCommandResult): result is IMultitoolCommandSuccess {
    return result.result === MultitoolCommandResult.SUCCESS;
  }

  return Object.freeze({
    executeCommand,
    executeCommands,
    isCommandFailedResult,
    isCommandSuccessResult,
  });
}

export default System.sealModule(multitool());
