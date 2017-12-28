import { Collection, Document } from 'firestorter';

const presentations = new Collection('presentations', 'on');
const activePresentation = new Document();

export { presentations, activePresentation };
