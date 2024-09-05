/* @file Show spinner
 * @arg 0 {string} - PPcID of execution source
 * @arg 1 {string} - Specify spinner name
 * @arg 2 {string} - Specify a special variable i name used to discard spinner
 *
 * Spinners adapted from: https://github.com/sindresorhus/cli-spinners
 *
 * MIT License
 * Copyright (c) Sindre Sorhus <sindresorhus@gmail.com> (https://sindresorhus.com)
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

import {safeArgs} from '@ppmdev/modules/argument.ts';

if (PPx.Extract('%n').indexOf('B') !== 0) {
  PPx.Quit(-1);
}

type SpinType = (typeof spinKeys)[number];
const spinKeys = ['dot', 'star', 'box', 'toggle'] as const;
const spinPattern = {
  [spinKeys[0]]: {interval: 100, frames: ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏']},
  [spinKeys[1]]: {interval: 100, frames: ['✶', '✸', '✹', '✺', '✹', '✷']},
  [spinKeys[2]]: {interval: 120, frames: ['▌', '▀', '▐', '▄']},
  [spinKeys[3]]: {interval: 500, frames: ['⊶', '⊷']}
};

const main = () => {
  const [ppcid, spinType, siName] = safeArgs('CA', 'dot', 'stop');
  const spinner = getSpinner(spinType);
  const len = spinner.frames.length;
  let i = 0;

  PPx.Execute(`*execute ${ppcid},*string i,${siName}=1`);

  while (true) {
    showSpinner(ppcid, spinner.frames[i]);
    PPx.Sleep(spinner.interval);

    if (PPx.Extract(`%*extract(${ppcid},"%%si'${siName}'")`) === '') {
      showSpinner(ppcid, ' ');
      break;
    }

    i = i < len - 1 ? i + 1 : 0;
  }
};

const getSpinner = (spinType: string): (typeof spinPattern)[SpinType] => {
  if (/^[0-3]$/.test(spinType)) {
    spinType = spinKeys[spinType as '0' | '1' | '2' | '3'];
  }

  return spinPattern[spinType as SpinType] ?? spinPattern.dot;
};

const showSpinner = (id: string, mark: string): number => PPx.Execute(`*execute ${id},*linemessage !"${mark}`);

main();
