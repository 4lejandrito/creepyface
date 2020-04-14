/**
 * @jest-environment node
 */

import creepyface from '../src/creepyface'

it('does not blow up', () => expect(creepyface).toBeDefined())
