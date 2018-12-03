import { Subject, of } from 'rxjs';
import { map, reduce, pairwise, scan } from 'rxjs/operators';
import { createInterface } from 'readline';
import { createReadStream } from 'fs';

class Reader {
    read(path: string) {
        const reader = createInterface({
            input: createReadStream(path),
            crlfDelay: Infinity
        });
        const s$ = new Subject<string>();
        reader.on('line', val => s$.next(val));
        reader.on('close', () => s$.complete());
        return s$.asObservable();
    }
}

class Frequencies {
    private readonly stream$ = this.reader
        .read(this.path)
        .pipe(map(s => parseInt(s, 10)));

    constructor(
        private readonly reader: Reader,
        private readonly path: string
    ) {}

    totalDifference() {
        return this.stream$.pipe(reduce((acc, val) => acc + val));
    }

    firstRepeatedFrequency() {
        return this.stream$.pipe(scan((acc, curr) => [acc + curr]));
    }
}

const f = new Frequencies(new Reader(), 'input-1.txt');
f.firstRepeatedFrequency().subscribe(v => console.log(v));
