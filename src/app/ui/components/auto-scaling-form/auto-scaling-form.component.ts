import {
  Component,
  inject,
  computed,
  ChangeDetectionStrategy,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  FormArray,
  FormControl,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { toSignal } from '@angular/core/rxjs-interop';
import { INSTANCE_PRICES, ScalingPolicy } from '../../../data/domain/scaling/models/scaling-policy.model';


type RuleForm = FormGroup<{
  metric: FormControl<'CPU' | 'RAM'>;
  operator: FormControl<'>' | '<'>;
  threshold: FormControl<number>;
  adjustment: FormControl<number>;
}>;

type PolicyForm = FormGroup<{
  policyName: FormControl<string>;
  baseInstanceType: FormControl<'t3.medium' | 'm5.large' | 'c6g.xlarge'>;
  baseNodes: FormControl<number>;
  maxNodes: FormControl<number>;
  rules: FormArray<RuleForm>;
}>;

@Component({
  selector: 'app-auto-scaling-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './auto-scaling-form.component.html',
  styleUrl: './auto-scaling-form.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AutoScalingFormComponent {
  private readonly fb = inject(FormBuilder);

  readonly instanceTypes: Array<{ id: 't3.medium' | 'm5.large' | 'c6g.xlarge'; label: string }> = [
    { id: 't3.medium', label: 't3.medium' },
    { id: 'm5.large', label: 'm5.large' },
    { id: 'c6g.xlarge', label: 'c6g.xlarge' },
  ];

  readonly metrics: Array<'CPU' | 'RAM'> = ['CPU', 'RAM'];
  readonly operators: Array<'>' | '<'> = ['>', '<'];

  readonly INSTANCE_PRICES = INSTANCE_PRICES;

  submitted = false;

  readonly policyForm: PolicyForm = this.fb.group({
    policyName: this.fb.nonNullable.control('', Validators.required),
    baseInstanceType: this.fb.nonNullable.control<'t3.medium' | 'm5.large' | 'c6g.xlarge'>(
      't3.medium',
      Validators.required
    ),
    baseNodes: this.fb.nonNullable.control(1, [
      Validators.required,
      Validators.min(1),
      Validators.max(50),
    ]),
    maxNodes: this.fb.nonNullable.control(10, [
      Validators.required,
      Validators.min(1),
      Validators.max(100),
    ]),
    rules: this.fb.array<RuleForm>([]),
  }) as PolicyForm;

  private readonly _formValue = toSignal(this.policyForm.valueChanges);

  readonly estimatedCost = computed(() => {
    const value = this._formValue() ?? this.policyForm.getRawValue();
    const pricePerNode = INSTANCE_PRICES[value.baseInstanceType ?? 't3.medium'] ?? 0;
    const nodes = value.baseNodes ?? 1;
    const rulesAdjustment = (value.rules ?? []).reduce(
      (sum: number, rule) => sum + (rule?.adjustment ?? 0),
      0
    );
    return pricePerNode * (nodes + Math.max(0, rulesAdjustment));
  });

  get rules(): FormArray<RuleForm> {
    return this.policyForm.controls.rules;
  }

  addRule(): void {
    const ruleGroup = this.fb.group({
      metric: this.fb.nonNullable.control<'CPU' | 'RAM'>('CPU', Validators.required),
      operator: this.fb.nonNullable.control<'>' | '<'>('>', Validators.required),
      threshold: this.fb.nonNullable.control(70, [
        Validators.required,
        Validators.min(1),
        Validators.max(100),
      ]),
      adjustment: this.fb.nonNullable.control(1, [
        Validators.required,
        Validators.min(1),
        Validators.max(20),
      ]),
    }) as RuleForm;

    this.rules.push(ruleGroup);
  }

  removeRule(index: number): void {
    this.rules.removeAt(index);
  }

  onSubmit(): void {
    this.submitted = true;
    if (this.policyForm.invalid) return;

    const policy: ScalingPolicy = this.policyForm.getRawValue();
    console.log('[AutoScaling] Policy saved:', policy);
    alert(`Policy "${policy.policyName}" saved (check console).`);
  }
}