import { ComponentFixture, TestBed } from '@angular/core/testing';
import { S3ViewComponent } from './s3-view.component';

describe('S3ViewComponent', () => {
    let component: S3ViewComponent;
    let fixture: ComponentFixture<S3ViewComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [S3ViewComponent]
        })
            .compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(S3ViewComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
