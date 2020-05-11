import { IMultitoolCommandFailed, IMultitoolCommandResult, IMultitoolCommandSuccess } from 'bf-types';
import { Nullable } from '../common';

export interface Multitool {
  /**
   * Execute one /n or /u multitool command
   *
   * @param command A string representation of a multitool command
   */
  executeCommand(command: string): Promise<IMultitoolCommandResult>;

  /**
   * Execute one or more /n or /u multitool commands
   *
   * @param commands An array of string representations of multitool commands
   */
  executeCommands(commands: string[]): Promise<IMultitoolCommandResult[]>;

  /**
   * Test whether or not a multitool command failed during execution
   *
   * @param result A result from executing a /n or /u multitool command
   */
  isCommandFailedResult(result: IMultitoolCommandResult): result is IMultitoolCommandFailed;

  /**
   * Test whether or not a multitool succeeded during execution
   *
   * @param result A result from executing a /n or /u multitool command
   */
  isCommandSuccessResult(result: IMultitoolCommandResult): result is IMultitoolCommandSuccess;

  /**
   * Run a full multitool script that uses /c type syntax
   *
   * Do not include /c in the script. /n and /u commands are not supported in
   * the scripts.
   *
   * @param script A full multitool script
   */
  runScript(script: string): Promise<Nullable<boolean>>;
}
