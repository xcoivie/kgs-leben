namespace Views {
    export class GoBoard implements Views.View<HTMLDivElement>{
        private _div: HTMLDivElement;
        private _board: WGo.Board;
        private _position: Models.GamePosition;

        public defaultSize: number = 19;

        public playCallback: (x: number, y: number) => void;

        constructor(defaultSize?: number) {
            this._div = document.createElement('div');
            this._div.className = 'go-board';
            if (defaultSize) this.defaultSize = defaultSize;
        }

        public attach(parent: HTMLElement): void {
            parent.appendChild(this._div);
        }

        public activate(): void {
            if (null == this._board) {
                this._board = new WGo.Board(this._div, {
                    size: (this._position != null)? this._position.size : this.defaultSize,
                    width: 688,
                    background: '/img/wood.jpg'
                });

                if (this._position != null) this.updatePosition(null, this._position);

                this._board.addEventListener("click", (x: number, y: number) => {
                    if (this.playCallback) this.playCallback(x, y);
                });
            }
        }
        public deactivate(): void {
        }

        public get size(): number {
            if (this._position) return this._position.size;
            else if (this._board) return this._board.size;
            else return undefined;
        }

        public clear() {
            if (this._board != null) {
                this._board.removeAllObjects();
            }

            this._position = null;
        }

        private updatePosition(oldPosition: Models.GamePosition, position: Models.GamePosition) {
            let changes = position.diff(oldPosition);
            for (let i = 0; i < changes.length; ++i) {
                if (changes[i].add != null)
                    this._board.addObject({ x: changes[i].x, y: changes[i].y, c: changes[i].add });
                else if (changes[i].remove != null)
                    this._board.removeObject({ x: changes[i].x, y: changes[i].y });
            }

            this._position = position;
        }

        public update(position: Models.GamePosition) {
            if (position != null) {
                if (this._board != null) {
                    if (this._board.size != position.size) {
                        this._board.setSize(position.size);
                        this.updatePosition(null, position);
                    }
                    else this.updatePosition(this._position, new Models.GamePosition(position));
                }
                else this._position = position;
            }
            else {
                this.clear();
                this._position = null;
            }
        }
    }
}
