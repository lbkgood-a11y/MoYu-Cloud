import { describe, expect, it } from 'vitest';
import { crudMetadata } from './metadata';
describe('crud metadata', () => {
  it('defines all standard resources', () => { expect(Object.keys(crudMetadata)).toEqual(expect.arrayContaining(['customer','user','role','menu','dictionary','modeling'])); });
  it('uses dictionary for customer status', () => { expect(crudMetadata.customer.fields.find(f=>f.code==='status')?.dictionary).toBe('customer_status'); });
});
